const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  phone: { type: String },
  location: { type: String },
  department: { type: String },
  year: { type: String },
  cgpa: { type: String },
  rollNo: { type: String },
  bio: { type: String },
  github: { type: String },
  linkedin: { type: String },
  portfolio: { type: String },
  resumeFileName: { type: String },
  skills: [{ 
    name: { type: String }, 
    level: { type: Number, default: 50 },
    category: { type: String }
  }],
  education: [{
    degree: { type: String },
    institution: { type: String },
    year: { type: String },
    grade: { type: String },
    status: { type: String, enum: ['current', 'completed'] }
  }],
  achievements: [{
    title: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
