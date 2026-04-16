const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');
const CDCStudentProfile = require('../models/CDCStudentProfile');
const { TestResult } = require('../models/Test');

// @route   GET api/dashboard/stats
// @desc    Get role-based dashboard statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role === 'cdc' || req.user.role === 'admin') {
      // CDC Stats
      const totalStudents = await CDCStudentProfile.countDocuments();
      const placedStudentsCount = await CDCStudentProfile.countDocuments({ placementStatus: 'Placed' });
      const activeJobs = await Job.countDocuments({
        $or: [
          { driveStatus: { $in: ['active', 'scheduled'] } },
          { status: 'open' }
        ]
      });
      const pendingApps = await Application.countDocuments({ status: { $in: ['applied', 'in-progress'] } });

      // Recent Activity Feed for CDC
      const recentActivity = await Application.find()
        .populate('student', 'name')
        .populate('job', 'company role')
        .sort({ updatedAt: -1 })
        .limit(5);

      return res.json({
        role: req.user.role,
        stats: [
          { label: 'Total Students', value: totalStudents },
          { label: 'Placement %', value: totalStudents > 0 ? Math.round((placedStudentsCount / totalStudents) * 100) : 0 },
          { label: 'Active Openings', value: activeJobs },
          { label: 'Pending Reviews', value: pendingApps }
        ],
        recentActivity: recentActivity.map(act => ({
          studentName: act.student?.name || 'Unknown',
          company: act.job?.company || 'N/A',
          role: act.job?.role || 'N/A',
          status: act.status,
          time: act.updatedAt
        }))
      });
    } else {
      // Student Stats
      const apps = await Application.find({ student: req.user.id });
      const appliedCount = apps.length;
      const offersCount = apps.filter(a => ['offered', 'accepted'].includes(a.status)).length;
      
      const upcomingInterviewsCount = apps.reduce((count, app) => {
        return count + app.rounds.filter(r => r.status === 'upcoming').length;
      }, 0);

      // Integration: Calculate actual readiness based on test history
      const testResults = await TestResult.find({ student: req.user.id });
      const avgScore = testResults.length > 0 
        ? Math.round(testResults.reduce((acc, curr) => acc + curr.score, 0) / testResults.length)
        : 0;
      
      const readinessValue = avgScore > 0 ? `${avgScore}%` : 'New';

      return res.json({
        role: 'student',
        stats: [
          { label: 'Applications', value: appliedCount },
          { label: 'Offers', value: offersCount },
          { label: 'Interviews', value: upcomingInterviewsCount },
          { label: 'Readiness', value: readinessValue }
        ]
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
