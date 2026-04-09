const mongoose = require('mongoose');

const RoundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  status: { type: String, enum: ['pending', 'upcoming', 'passed', 'failed'], default: 'pending' },
  date: { type: String, default: 'TBD' },
  time: { type: String },
  score: { type: String },
  feedback: { type: String }
});

const ApplicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appliedDate: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['applied', 'in-progress', 'shortlisted', 'offered', 'rejected', 'accepted'], 
    default: 'applied' 
  },
  currentRound: { type: Number, default: 0 },
  totalRounds: { type: Number, default: 1 },
  rounds: [RoundSchema],
  offerDetails: {
    deadline: { type: String },
    stipend: { type: String },
    duration: { type: String },
    ctc: { type: String }
  }
}, { timestamps: true });

// Ensure a student can only apply once to a specific job
ApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
