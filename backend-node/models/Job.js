const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  logo: { type: String, default: 'C' },
  logoColor: { type: String, default: '#3b82f6' },
  location: { type: String, required: true },
  type: { type: String, enum: ['Full Time', 'Internship', 'Contract'], default: 'Full Time' },
  ctc: { type: String, required: true },
  deadline: { type: Date, required: true },
  postedDate: { type: Date, default: Date.now },
  tags: [{ type: String }],
  description: { type: String },
  eligibility: { type: String },
  status: { type: String, enum: ['open', 'closed', 'processing'], default: 'open' },
  applicantsCount: { type: Number, default: 0 },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // The CDC admin who created it

  // ─── ENHANCED ELIGIBILITY CRITERIA ────────────────────────────────────────
  eligibilityCriteria: {
    minCGPA: { type: Number, default: 7.0 },
    allowedBranches: [{ type: String, enum: ['CSE', 'ICT', 'ECE', 'Mechanical', 'Civil', 'EE', 'Chemical'] }],
    maxTotalBacklogs: { type: Number, default: 0 },
    allowActiveBacklogs: { type: Boolean, default: false },
    requiredSkills: [{ type: String }], // e.g., ['Python', 'JavaScript']
    alreadyPlacedRestriction: { type: Boolean, default: false }, // if true, placed students cannot apply
  },
  roundDetails: [{
    name: { type: String },
    date: { type: Date },
    time: { type: String },
    description: { type: String }
  }],
  bondInfo: {
    hasBond: { type: Boolean, default: false },
    bondDuration: { type: Number }, // In months
  },
  companyCTC: { type: Number }, // Numeric CTC in LPA for sorting
  selectedCount: { type: Number, default: 0 },
  acceptedCount: { type: Number, default: 0 },
  driveStatus: { type: String, enum: ['scheduled', 'active', 'completed', 'cancelled'], default: 'scheduled' }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
