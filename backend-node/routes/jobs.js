const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 }).lean();
    
    // For CDC/Admin, also return application counts
    const jobsWithCounts = await Promise.all(jobs.map(async job => {
      const applicantsCount = await Application.countDocuments({ job: job._id });
      return { ...job, applicantsCount };
    }));
    
    res.json(jobsWithCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/jobs
// @desc    Create a job
// @access  Private (CDC only)
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'cdc') {
    return res.status(401).json({ msg: 'User not authorized to post jobs' });
  }

  const { role, company, location, type, ctc, deadline, tags, description, eligibility, rounds } = req.body;

  try {
    const newJob = new Job({ role, company, location, type, ctc, deadline, tags, description, eligibility, rounds, postedBy: req.user.id });
    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
