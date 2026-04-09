const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @route   GET api/analytics/summary
// @desc    Get placement overview summary
// @access  Private (CDC and Admin only)
router.get('/summary', auth, async (req, res) => {
  // Restrict to CDC or admin for now. Student/Interviewer shouldn't see full analytics unless specified.
  if (!['cdc', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ msg: 'Access denied: Analytics for CDC only' });
  }

  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'open' });

    // Aggregate placement stats
    const applications = await Application.find().populate('job');
    const totalOffers = applications.filter(app => ['offered', 'accepted'].includes(app.status)).length;
    
    // Number of unique students with an accepted or offered status
    const placedStudentsSet = new Set(
      applications
        .filter(app => ['offered', 'accepted'].includes(app.status))
        .map(app => app.student.toString())
    );
    const placedStudents = placedStudentsSet.size;

    // Sector Distribution based on Job Type or Tags
    const sectorCounts = {
      'IT Services': 0,
      'Product / SaaS': 0,
      'FinTech': 0,
      'Core / Others': 0
    };

    const jobs = await Job.find();
    jobs.forEach(job => {
      // Heuristic sector mapping
      const combined = (job.role + ' ' + (job.tags || []).join(' ') + ' ' + (job.description || '')).toLowerCase();
      
      if (combined.includes('fintech') || combined.includes('banking') || combined.includes('finance')) {
        sectorCounts['FinTech']++;
      } else if (combined.includes('product') || combined.includes('saas') || combined.includes('software engineer')) {
        sectorCounts['Product / SaaS']++;
      } else if (combined.includes('consulting') || combined.includes('service')) {
        sectorCounts['IT Services']++;
      } else {
        sectorCounts['Core / Others']++;
      }
    });

    const sectors = Object.keys(sectorCounts).map(key => ({
      sector: key,
      percentage: totalJobs > 0 ? Math.round((sectorCounts[key] / totalJobs) * 100) : 0,
      color: key === 'IT Services' ? '#818cf8' : key === 'Product / SaaS' ? '#38bdf8' : key === 'FinTech' ? '#c084fc' : '#fca5a5'
    }));

    // Generate trends (Monthly)
    // For now, let's look at applications over the last 6 months
    const now = new Date();
    const months = [];
    const counts = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mLabel = d.toLocaleString('default', { month: 'short' });
      months.push(mLabel);
      
      // Real count from DB:
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const count = await Application.countDocuments({
        createdAt: { $gte: d, $lte: endOfMonth },
        status: { $in: ['offered', 'accepted'] }
      });
      counts.push(count);
    }

    // Recent drives
    const recentDrives = await Job.find()
      .sort({ deadline: 1 })
      .limit(5)
      .select('company role deadline status applicantsCount');

    res.json({
      stats: [
        { label: 'Total Students', value: totalStudents, change: '+2%', color: 'var(--primary)' },
        { label: 'Placed Students', value: placedStudents, change: '+15%', color: 'var(--success)' },
        { label: 'Total Offers', value: totalOffers, change: '+8%', color: 'var(--accent)' },
        { label: 'Active Companies', value: totalJobs, change: '+5%', color: 'var(--warning)' },
      ],
      sectors,
      trends: { labels: months, counts },
      recentDrives: recentDrives.map(d => ({
        company: d.company,
        date: new Date(d.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: d.status === 'open' ? 'Confirmed' : 'Pending',
        applicants: d.applicantsCount || 0
      }))
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/analytics/export
// @desc    Export placement data as CSV
// @access  Private (CDC only)
router.get('/export', auth, async (req, res) => {
  if (req.user.role !== 'cdc') {
    return res.status(403).json({ msg: 'Access denied' });
  }

  try {
    const applications = await Application.find()
      .populate('student', 'name email')
      .populate('job', 'company role ctc');

    let csv = 'Student Name,Student Email,Company,Role,CTC,Status,Applied Date\n';
    
    applications.forEach(app => {
      csv += `"${app.student.name}","${app.student.email}","${app.job.company}","${app.job.role}","${app.job.ctc}","${app.status}","${app.appliedDate.toDateString()}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=placement_report.csv');
    res.status(200).send(csv);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

