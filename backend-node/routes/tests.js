const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { Question, TestResult } = require('../models/Test');

// GET /api/tests/questions/:category
// Returns up to 10 questions for the given category.
// Optional query param: ?difficulty=easy|medium|hard  (omit for all difficulties)
router.get('/questions/:category', auth, async (req, res) => {
  try {
    const { category } = req.params;
    const { difficulty } = req.query;

    const filter = { category };
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    // Fetch a balanced set: try to get 10 questions mixing difficulties
    let questions;
    if (!difficulty) {
      // Return a mix: 3 easy, 4 medium, 3 hard (or whatever is available)
      const easy   = await Question.find({ category, difficulty: 'easy'   }).limit(3).lean();
      const medium = await Question.find({ category, difficulty: 'medium' }).limit(4).lean();
      const hard   = await Question.find({ category, difficulty: 'hard'   }).limit(3).lean();
      questions = [...easy, ...medium, ...hard];
      // Shuffle
      questions = questions.sort(() => Math.random() - 0.5);
    } else {
      questions = await Question.find(filter).limit(10).lean();
    }

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/tests/submit — Save a test result
router.post('/submit', auth, async (req, res) => {
  try {
    const { category, score, totalQuestions, duration, correctCount, difficulty } = req.body;
    const result = new TestResult({
      student: req.user.id,
      category,
      score,
      totalQuestions,
      duration,
      correctCount,
      difficulty: difficulty || 'mixed'
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
