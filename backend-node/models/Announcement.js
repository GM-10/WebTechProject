const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // CDC admin
  createdByName: { type: String, default: 'CDC Admin' },
  
  // Target Audience
  targetAudience: {
    type: { 
      type: String, 
      enum: ['all', 'eligible', 'branch', 'shortlisted'],
      default: 'all' 
    },
    branch: { type: String }, // For branch-specific
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' } // For shortlisted for a specific job
  },
  
  // Status tracking
  status: { type: String, enum: ['sent', 'pending', 'scheduled'], default: 'sent' },
  sendAt: { type: Date, default: Date.now },
  read: {
    total: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 }
  },
  recipientCount: { type: Number, default: 0 },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // List of students who should receive
  
  // Priority and metadata
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  pinned: { type: Boolean, default: false },
  
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
