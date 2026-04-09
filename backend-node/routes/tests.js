const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Question, TestResult } = require('../models/Test');

// Get questions for a specific category
router.get('/questions/:category', auth, async (req, res) => {
  try {
    const category = req.params.category;
    const questions = await Question.find({ category }).limit(10).lean();
    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Submit test results
router.post('/submit', auth, async (req, res) => {
  try {
    const { category, score, totalQuestions, duration } = req.body;
    const result = new TestResult({
      student: req.user.id,
      category,
      score,
      totalQuestions,
      duration
    });
    await result.save();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Get user test history
router.get('/history', auth, async (req, res) => {
  try {
    const history = await TestResult.find({ student: req.user.id }).sort('-completedAt');
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
