const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Profile = require('../models/Profile');
const CDCStudentProfile = require('../models/CDCStudentProfile');
const CDCNote = require('../models/CDCNote');
const Application = require('../models/Application');

// Middleware: CDC/Admin only
const cdcOnly = (req, res, next) => {
  if (!['cdc', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Access denied: CDC only' });
  }
  next();
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/cdc/students
// List all students with their cdc profile + basic profile info
// Supports query params: branch, minCgpa, maxCgpa, placementStatus, eligibility, search
// ─────────────────────────────────────────────────────────────────────────────
router.get('/students', auth, cdcOnly, async (req, res) => {
  try {
    const { branch, minCgpa, maxCgpa, placementStatus, eligibility, search } = req.query;

    // Build filter for CDCStudentProfile
    const cdcFilter = {};
    if (branch) cdcFilter.branch = branch;
    if (placementStatus) cdcFilter.placementStatus = placementStatus;
    if (eligibility) cdcFilter.eligibilityStatus = eligibility;
    if (minCgpa || maxCgpa) {
      cdcFilter.cgpa = {};
      if (minCgpa) cdcFilter.cgpa.$gte = parseFloat(minCgpa);
      if (maxCgpa) cdcFilter.cgpa.$lte = parseFloat(maxCgpa);
    }

    let cdcProfiles = await CDCStudentProfile.find(cdcFilter)
      .populate('user', 'name email avatar')
      .lean();

    // Apply search filter on name/rollNo
    if (search) {
      const q = search.toLowerCase();
      cdcProfiles = cdcProfiles.filter(p =>
        p.user?.name?.toLowerCase().includes(q) ||
        p.rollNo?.toLowerCase().includes(q)
      );
    }

    // Fetch skills from Profile for each student
    const userIds = cdcProfiles.map(p => p.user?._id);
    const profiles = await Profile.find({ user: { $in: userIds } }).lean();
    const profileMap = {};
    profiles.forEach(p => { profileMap[p.user.toString()] = p; });

    // Fetch latest application per student
    const applications = await Application.find({ student: { $in: userIds } })
      .populate('job', 'company role')
      .sort({ updatedAt: -1 })
      .lean();
    const appMap = {};
    applications.forEach(app => {
      const sid = app.student.toString();
      if (!appMap[sid]) appMap[sid] = app; // only keep latest
    });

    const result = cdcProfiles.map(p => {
      const uid = p.user?._id?.toString();
      const baseProfile = profileMap[uid] || {};
      const latestApp = appMap[uid] || null;
      return {
        _id: p._id,
        userId: uid,
        name: p.user?.name || 'Unknown',
        email: p.user?.email || '',
        rollNo: p.rollNo,
        branch: p.branch,
        cgpa: p.cgpa,
        activeBacklogs: p.activeBacklogs,
        totalBacklogs: p.totalBacklogs,
        atsScore: p.atsScore,
        readinessScore: p.readinessScore,
        placementStatus: p.placementStatus,
        placedAt: p.placedAt,
        ctcOffered: p.ctcOffered,
        eligibilityStatus: p.eligibilityStatus,
        eligibilityReason: p.eligibilityReason,
        codingProfile: p.codingProfile,
        skills: (baseProfile.skills || []).map(s => s.name),
        latestAppStatus: latestApp ? latestApp.status : 'No Applications',
        latestAppCompany: latestApp?.job?.company || '',
        resumeUrl: p.resumeUrl,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('CDC students list error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/cdc/students/:userId
// Full profile for one student
// ─────────────────────────────────────────────────────────────────────────────
router.get('/students/:userId', auth, cdcOnly, async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password').lean();
    if (!user) return res.status(404).json({ msg: 'Student not found' });

    const profile = await Profile.findOne({ user: userId }).lean();
    const cdcProfile = await CDCStudentProfile.findOne({ user: userId }).lean();
    const notes = await CDCNote.find({ student: userId }).sort({ createdAt: -1 }).lean();
    const applications = await Application.find({ student: userId })
      .populate('job', 'company role ctc type location')
      .sort({ updatedAt: -1 })
      .lean();

    res.json({
      user,
      profile: profile || {},
      cdcProfile: cdcProfile || {},
      notes,
      applications,
    });
  } catch (err) {
    console.error('CDC student detail error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/cdc/students/:userId/notes
// Get notes for a specific student
// ─────────────────────────────────────────────────────────────────────────────
router.get('/students/:userId/notes', auth, cdcOnly, async (req, res) => {
  try {
    const notes = await CDCNote.find({ student: req.params.userId }).sort({ createdAt: -1 }).lean();
    res.json(notes);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/cdc/students/:userId/notes
// Add a note to a student
// ─────────────────────────────────────────────────────────────────────────────
router.post('/students/:userId/notes', auth, cdcOnly, async (req, res) => {
  try {
    const { note } = req.body;
    if (!note || !note.trim()) return res.status(400).json({ msg: 'Note cannot be empty' });

    const cdcUser = await User.findById(req.user.id).select('name').lean();
    const newNote = new CDCNote({
      student: req.params.userId,
      note: note.trim(),
      addedBy: req.user.id,
      addedByName: cdcUser?.name || 'CDC Admin',
    });
    await newNote.save();
    res.json(newNote);
  } catch (err) {
    console.error('CDC add note error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
