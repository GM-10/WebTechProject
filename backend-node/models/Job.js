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
  rounds: [{ type: String }],
  status: { type: String, enum: ['open', 'closed', 'processing'], default: 'open' },
  applicantsCount: { type: Number, default: 0 },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // The CDC admin who created it
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
