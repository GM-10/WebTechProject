const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Question, TestResult } = require('../models/Test');

// GET /api/tests/questions/:category
// Returns exactly 25 random questions for the given category.
// Optional query param: ?difficulty=easy|medium|hard
router.get('/questions/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const { difficulty } = req.query;

    const filter = { category };
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    // Use aggregate $sample for high-performance randomization
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: 25 } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ msg: 'No questions found for this category.' });
    }

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/tests/submit — Save a test result with detailed analytics
router.post('/submit', auth, async (req, res) => {
  try {
    const { 
      category, 
      score, 
      totalQuestions, 
      duration, 
      correctCount, 
      difficulty,
      totalPoints,
      maxPoints,
      questionDetails 
    } = req.body;

    const result = new TestResult({
      student: req.user.id,
      category,
      score,
      totalQuestions,
      duration,
      correctCount,
      difficulty: difficulty || 'mixed',
      totalPoints: totalPoints || 0,
      maxPoints: maxPoints || 0,
      questionDetails: questionDetails || []
    });

    await result.save();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/tests/history — Get logged-in user's test history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await TestResult.find({ student: req.user.id }).sort('-completedAt');
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// GET /api/tests/stats — Aggregate stats per category for the logged-in user
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await TestResult.aggregate([
      { $match: { student: req.user._id } },
      {
        $group: {
          _id: '$category',
          avgScore: { $avg: '$score' },
          count:    { $sum: 1 }
        }
      }
    ]);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
