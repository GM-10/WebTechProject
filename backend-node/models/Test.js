const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }, // Index of correct option
  category: { type: String, required: true, enum: ['dsa', 'sysdesign', 'csCore', 'aptitude'] },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const TestResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  duration: { type: String }, // e.g., "30 mins"
  completedAt: { type: Date, default: Date.now }
});

module.exports = {
  Question: mongoose.model('Question', QuestionSchema),
  TestResult: mongoose.model('TestResult', TestResultSchema)
};
