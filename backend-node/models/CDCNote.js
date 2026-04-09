const mongoose = require('mongoose');

const CDCNoteSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  note: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addedByName: { type: String, default: 'CDC Admin' },
}, { timestamps: true });

module.exports = mongoose.model('CDCNote', CDCNoteSchema);
