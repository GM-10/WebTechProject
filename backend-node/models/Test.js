const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text:          { type: String, required: true },
  options:       [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  category:      { type: String, required: true, enum: ['dsa', 'sysdesign', 'csCore', 'aptitude'] },
  difficulty:    { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  efficientTime: { type: Number }, // benchmark seconds: easy=45, medium=90, hard=150
  tags:          [String],
  createdAt:     { type: Date, default: Date.now }
});

// Detailed record per question inside a test result
const QuestionDetailSchema = new mongoose.Schema({
  questionId:     { type: mongoose.Schema.Types.ObjectId },
  questionText:   { type: String },
  timeSpent:      { type: Number, default: 0 },   // actual seconds spent on this question
  efficientTime:  { type: Number, default: 90 },  // benchmark seconds
  isCorrect:      { type: Boolean, default: false },
  wasSkipped:     { type: Boolean, default: true },
  selectedOption: { type: Number, default: -1 },
  correctOption:  { type: Number },
  difficulty:     { type: String },
  pointsEarned:   { type: Number, default: 0 },
  maxPoints:      { type: Number, default: 0 },
}, { _id: false });

const TestResultSchema = new mongoose.Schema({
  student:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category:        { type: String, required: true },
  score:           { type: Number, required: true },       // percentage 0–100
  totalQuestions:  { type: Number, required: true },
  correctCount:    { type: Number, default: 0 },
  totalPoints:     { type: Number, default: 0 },
  maxPoints:       { type: Number, default: 0 },
  totalTimeSpent:  { type: Number, default: 0 },           // total seconds
  duration:        { type: String },
  questionDetails: [QuestionDetailSchema],
  completedAt:     { type: Date, default: Date.now }
});

module.exports = {
  Question:   mongoose.model('Question',   QuestionSchema),
  TestResult: mongoose.model('TestResult', TestResultSchema)
};
