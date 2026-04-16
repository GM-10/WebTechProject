const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Application = require('../models/Application');
const Job = require('../models/Job');

function getJobRoundDetails(job) {
  if (Array.isArray(job?.roundDetails) && job.roundDetails.length > 0) {
    return job.roundDetails;
  }

  if (Array.isArray(job?.rounds) && job.rounds.length > 0) {
    return job.rounds.map((round) => (
      typeof round === 'string' ? { name: round } : round
    ));
  }

  return [];
}

// @route   GET api/applications
// @desc    Get all applications (for student - their own, for CDC - all)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let applications;
    if (req.user.role === 'student') {
      applications = await Application.find({ student: req.user.id }).populate('job');
    } else {
      applications = await Application.find().populate('job').populate('student', ['name', 'email']);
    }
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/applications
// @desc    Apply for a job
// @access  Private (student only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(401).json({ msg: 'Only students can apply for jobs' });
  }

  const { jobId } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    // Round setup
    const jobRounds = getJobRoundDetails(job);
    const rounds = jobRounds.map((round) => ({
      name: typeof round === 'string' ? round : round?.name,
      status: 'pending'
    }));

    const newApp = new Application({
      job: jobId,
      student: req.user.id,
      totalRounds: jobRounds.length,
      rounds: rounds
    });

    const application = await newApp.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/applications/:id
// @desc    Update application status or round
// @access  Private (CDC or Interviewer)
router.put('/:id', auth, async (req, res) => {
  if (req.user.role === 'student') {
    return res.status(401).json({ msg: 'Students cannot update application outcomes' });
  }

  const { status, currentRound, rounds } = req.body;

  try {
    let application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ msg: 'Application not found' });

    if (status) application.status = status;
    if (currentRound !== undefined) application.currentRound = currentRound;
    if (rounds) application.rounds = rounds;

    await application.save();
    res.json(application);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/applications/schedule/:id/:roundIndex

// @desc    Schedule a round for an application
// @access  Private (CDC only)
router.post('/schedule/:id/:roundIndex', auth, async (req, res) => {
  if (!['cdc', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Only CDC can schedule interviews' });
  }

  const { date, time } = req.body;
  const { id, roundIndex } = req.params;

  try {
    const application = await Application.findById(id).populate('job').populate('student', 'name');
    if (!application) return res.status(404).json({ msg: 'Application not found' });

    if (!application.rounds[roundIndex]) {
      return res.status(400).json({ msg: 'Invalid round index' });
    }

    application.rounds[roundIndex].date = date;
    application.rounds[roundIndex].time = time;
    application.rounds[roundIndex].status = 'upcoming';

    await application.save();

    // Emit Real-time Notification
    if (req.io) {
      req.io.emit('notification', {
        studentId: application.student._id,
        type: 'interview_scheduled',
        message: `Your interview for ${application.job.role} at ${application.job.company} is scheduled for ${date} at ${time}.`,
        applicationId: application._id
      });
    }

    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

