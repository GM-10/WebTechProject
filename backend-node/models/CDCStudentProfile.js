const mongoose = require('mongoose');

const CDCStudentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  rollNo: { type: String, required: true },
  branch: { type: String, enum: ['CSE', 'ICT', 'ECE', 'Mechanical', 'Civil', 'EE', 'Chemical'], required: true },
  cgpa: { type: Number, required: true },
  activeBacklogs: { type: Number, default: 0 },
  totalBacklogs: { type: Number, default: 0 },
  atsScore: { type: Number, default: 0 },       // 0–100
  readinessScore: { type: Number, default: 0 }, // 0–100
  placementStatus: { type: String, enum: ['Placed', 'Unplaced', 'Processing'], default: 'Unplaced' },
  placedAt: { type: String, default: '' },      // Company name if placed
  ctcOffered: { type: String, default: '' },
  codingProfile: {
    platform: { type: String, default: 'LeetCode' },
    handle: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    problemsSolved: { type: Number, default: 0 }
  },
  mockTestScores: [{
    category: { type: String },
    score: { type: Number },
    total: { type: Number },
    date: { type: Date, default: Date.now }
  }],
  // Eligibility: auto-derived (CGPA >= 7.0 AND activeBacklogs === 0), can be overridden
  eligibilityStatus: { type: String, enum: ['Eligible', 'Ineligible', 'Conditional'], default: 'Ineligible' },
  eligibilityReason: { type: String, default: '' },
  resumeUrl: { type: String, default: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
}, { timestamps: true });

// Auto-derive eligibility on save
CDCStudentProfileSchema.pre('save', function () {
  if (this.cgpa >= 7.0 && this.activeBacklogs === 0) {
    this.eligibilityStatus = 'Eligible';
    this.eligibilityReason = 'Meets CGPA ≥ 7.0 and no active backlogs';
  } else {
    this.eligibilityStatus = 'Ineligible';
    const reasons = [];
    if (this.cgpa < 7.0) reasons.push(`CGPA ${this.cgpa} < 7.0`);
    if (this.activeBacklogs > 0) reasons.push(`${this.activeBacklogs} active backlog(s)`);
    this.eligibilityReason = reasons.join('; ');
  }
});

module.exports = mongoose.model('CDCStudentProfile', CDCStudentProfileSchema);
