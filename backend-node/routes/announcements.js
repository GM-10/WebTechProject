const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Announcement = require('../models/Announcement');
const User = require('../models/User');
const CDCStudentProfile = require('../models/CDCStudentProfile');

// Middleware: CDC/Admin only
const cdcOnly = (req, res, next) => {
  if (!['cdc', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Access denied: CDC only' });
  }
  next();
};

// @route   GET api/announcements
// @desc    Get announcements for current user (CDC gets all sent, students get those sent to them)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    if (['cdc', 'admin'].includes(req.user.role)) {
      // CDC sees all announcements
      query.createdBy = req.user.id;
    } else {
      // Students see announcements sent to them
      query.recipients = req.user.id;
    }

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   GET api/announcements/cdc/all
// @desc    Get all announcements for CDC admin
// @access  Private (CDC only)
router.get('/cdc/all', auth, cdcOnly, async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const withCounts = announcements.map(ann => ({
      ...ann,
      readPercentage: ann.recipientCount > 0 ? Math.round((ann.read.count / ann.recipientCount) * 100) : 0
    }));

    res.json(withCounts);
  } catch (err) {
    console.error('Error fetching announcements:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   POST api/announcements
// @desc    Create a new announcement
// @access  Private (CDC only)
router.post('/', auth, cdcOnly, async (req, res) => {
  try {
    const { title, message, targetAudience, priority, pinned } = req.body;

    if (!title || !message) {
      return res.status(400).json({ msg: 'Title and message are required' });
    }

    // Determine recipients based on target audience
    let recipients = [];
    
    if (targetAudience.type === 'all') {
      // All students
      const allStudents = await User.find({ role: 'student' }).select('_id').lean();
      recipients = allStudents.map(s => s._id);
    } else if (targetAudience.type === 'eligible') {
      // All eligible students (CGPA >= 7.0 and no active backlogs)
      const eligibleStudents = await CDCStudentProfile.find({
        cgpa: { $gte: 7.0 },
        activeBacklogs: 0
      }).select('user').lean();
      recipients = eligibleStudents.map(s => s.user);
    } else if (targetAudience.type === 'branch') {
      // Students from a specific branch
      const branchStudents = await CDCStudentProfile.find({
        branch: targetAudience.branch
      }).select('user').lean();
      recipients = branchStudents.map(s => s.user);
    } else if (targetAudience.type === 'shortlisted') {
      // Students shortlisted for a specific company
      const Application = require('../models/Application');
      const shortlistedApps = await Application.find({
        job: targetAudience.jobId,
        status: { $in: ['shortlisted', 'offered', 'accepted'] }
      }).select('student').lean();
      recipients = shortlistedApps.map(app => app.student);
    }

    // Create announcement
    const announcement = new Announcement({
      title,
      message,
      targetAudience,
      createdBy: req.user.id,
      createdByName: req.user.name || 'CDC Admin',
      recipients,
      recipientCount: recipients.length,
      status: 'sent',
      priority: priority || 'medium',
      pinned: pinned || false
    });

    await announcement.save();
    res.json(announcement);
  } catch (err) {
    console.error('Error creating announcement:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   PUT api/announcements/:id/read
// @desc    Mark announcement as read by student
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }

    if (!announcement.recipients.includes(req.user.id)) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    // Update read count if not already read by this user
    if (!announcement.read.users) {
      announcement.read.users = [];
    }

    if (!announcement.read.users.includes(req.user.id.toString())) {
      announcement.read.users.push(req.user.id.toString());
      announcement.read.count = announcement.read.users.length;
      announcement.read.percentage = Math.round((announcement.read.count / announcement.recipientCount) * 100);
      await announcement.save();
    }

    res.json(announcement);
  } catch (err) {
    console.error('Error updating announcement:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// @route   DELETE api/announcements/:id
// @desc    Delete an announcement
// @access  Private (CDC only)
router.delete('/:id', auth, cdcOnly, async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }

    if (announcement.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Unauthorized' });
    }

    await announcement.deleteOne();
    res.json({ msg: 'Announcement deleted' });
  } catch (err) {
    console.error('Error deleting announcement:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
