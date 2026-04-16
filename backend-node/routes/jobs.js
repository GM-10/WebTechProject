const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Profile = require('../models/Profile');
const CDCStudentProfile = require('../models/CDCStudentProfile');
const { getEligibleStudents, checkStudentEligibility } = require('../utils/eligibilityEngine');

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

function normalizeSkills(skillList = []) {
  return skillList
    .map((s) => (typeof s === 'string' ? s : s?.name))
    .filter(Boolean)
    .map((s) => String(s).trim().toLowerCase());
}

async function computeStudentMatch(job, studentProfile, baseProfile) {
  const studentSkills = normalizeSkills(baseProfile?.skills || []);
  const requiredSkills = normalizeSkills(job?.eligibilityCriteria?.requiredSkills || []);
  const jobTags = normalizeSkills(job?.tags || []);

  const eligibilityResult = await checkStudentEligibility(
    studentProfile,
    job?.eligibilityCriteria || {},
    baseProfile || {}
  );

  let skillScore = 0;
  if (requiredSkills.length > 0) {
    const matchedRequired = requiredSkills.filter((s) => studentSkills.includes(s)).length;
    skillScore += (matchedRequired / requiredSkills.length) * 50;
  } else {
    skillScore += 25;
  }

  if (jobTags.length > 0) {
    const matchedTags = jobTags.filter((t) => studentSkills.includes(t)).length;
    skillScore += (matchedTags / jobTags.length) * 20;
  } else {
    skillScore += 10;
  }

  const minCGPA = Number(job?.eligibilityCriteria?.minCGPA || 0);
  const studentCGPA = Number(studentProfile?.cgpa || baseProfile?.cgpa || 0);
  let cgpaScore = 0;
  if (minCGPA > 0) {
    if (studentCGPA >= minCGPA) cgpaScore = 20;
    else cgpaScore = Math.max(0, (studentCGPA / minCGPA) * 20);
  } else {
    cgpaScore = Math.min(20, (studentCGPA / 10) * 20);
  }

  const backlogPenalty = Math.min(15, Number(studentProfile?.activeBacklogs || 0) * 5);
  const eligibilityBonus = eligibilityResult.eligible ? 10 : 0;

  const rawScore = skillScore + cgpaScore + eligibilityBonus - backlogPenalty;
  const match = Math.max(0, Math.min(100, Math.round(rawScore)));

  return {
    match,
    isEligible: eligibilityResult.eligible,
    ineligibleReasons: eligibilityResult.reasons || []
  };
}

// @route   GET api/jobs
// @desc    Get all jobs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 }).lean();

    // For CDC/Admin, return application counts.
    if (['cdc', 'admin'].includes(req.user.role)) {
      const jobsWithCounts = await Promise.all(jobs.map(async job => {
        const applicantsCount = await Application.countDocuments({ job: job._id });
        const roundDetails = getJobRoundDetails(job);
        return { ...job, applicantsCount, roundDetails, rounds: roundDetails.map((round) => round.name).filter(Boolean) };
      }));

      return res.json(jobsWithCounts);
    }

    // For students, compute personalized match per job.
    const [studentProfile, baseProfile] = await Promise.all([
      CDCStudentProfile.findOne({ user: req.user.id }).lean(),
      Profile.findOne({ user: req.user.id }).lean()
    ]);

    const jobsWithCounts = await Promise.all(jobs.map(async job => {
      const applicantsCount = await Application.countDocuments({ job: job._id });
      const personalized = await computeStudentMatch(job, studentProfile, baseProfile);
      const roundDetails = getJobRoundDetails(job);
      return {
        ...job,
        applicantsCount,
        applicants: applicantsCount,
        match: personalized.match,
        isEligible: personalized.isEligible,
        ineligibleReasons: personalized.ineligibleReasons,
        roundDetails,
        rounds: roundDetails.map((round) => round.name).filter(Boolean)
      };
    }));

    res.json(jobsWithCounts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/cdc/all
// @desc    Get all jobs for CDC (with eligibility counts)
// @access  Private (CDC only)
router.get('/cdc/all', auth, async (req, res) => {
  if (!['cdc', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Access denied: CDC only' });
  }

  try {
    const jobs = await Job.find().sort({ companyCTC: -1 }).lean();

    const jobsWithDetails = await Promise.all(jobs.map(async job => {
      const applicants = await Application.countDocuments({ job: job._id });
      const selected = await Application.countDocuments({ job: job._id, status: { $in: ['offered', 'accepted'] } });
      const eligible = await getEligibleStudents(job);
      const roundDetails = getJobRoundDetails(job);

      return {
        ...job,
        applicantsCount: applicants,
        selectedCount: selected,
        eligibleCount: eligible.eligible.length,
        roundDetails,
        rounds: roundDetails.map((round) => round.name).filter(Boolean)
      };
    }));

    res.json(jobsWithDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/jobs
// @desc    Create a job
// @access  Private (CDC only)
router.post('/', auth, async (req, res) => {
  if (!['cdc', 'admin'].includes(req.user.role)) {
    return res.status(401).json({ msg: 'User not authorized to post jobs' });
  }

  const { 
    role, company, location, type, ctc, companyCTC, deadline, tags, description, 
    eligibility, rounds, eligibilityCriteria, roundDetails, bondInfo, driveStatus 
  } = req.body;

  const normalizedRoundDetails = Array.isArray(roundDetails) && roundDetails.length > 0
    ? roundDetails
    : Array.isArray(rounds)
      ? rounds.map((round) => (typeof round === 'string' ? { name: round } : round)).filter(Boolean)
      : [];

  try {
    const newJob = new Job({ 
      role, company, location, type, ctc, companyCTC, deadline, tags, description, 
      eligibility, eligibilityCriteria, roundDetails: normalizedRoundDetails, bondInfo, driveStatus,
      postedBy: req.user.id 
    });
    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/:id/eligible-students
// @desc    Get eligible students for a job
// @access  Private (CDC only)
router.get('/:id/eligible-students', auth, async (req, res) => {
  if (!['cdc', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Access denied: CDC only' });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    const { eligible, ineligible } = await getEligibleStudents(job);
    res.json({ eligible, ineligible, totalEligible: eligible.length, totalIneligible: ineligible.length });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
