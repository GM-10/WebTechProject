import React, { useState, useEffect, useCallback } from 'react';
import {
  BrainCircuit, PlayCircle, Timer, CheckCircle, Settings,
  History, BarChart, Clock, Award, ChevronRight, ChevronLeft,
  Flame, Star, Zap, RefreshCw, Filter, Trophy, Target,
  AlertCircle, XCircle, BookOpen
} from 'lucide-react';
import './MockTests.css';
import api from '../utils/api';

const testCategories = [
  { id: 'dsa',       name: 'Data Structures & Algorithms', icon: BrainCircuit, color: '#818cf8', count: 10 },
  { id: 'sysdesign', name: 'System Design',                icon: Settings,     color: '#38bdf8', count: 10 },
  { id: 'csCore',    name: 'CS Core (OS, DBMS, Networks)',  icon: BarChart,     color: '#c084fc', count: 10 },
  { id: 'aptitude',  name: 'Quantitative Aptitude',         icon: Timer,        color: '#fca5a5', count: 10 },
];

const difficultyConfig = {
  easy:   { label: 'Easy',   color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: Star,  points: 10 },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: Zap,   points: 20 },
  hard:   { label: 'Hard',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: Flame, points: 30 },
};

const TIME_PER_QUESTION = 90; // seconds per question → 10 questions = 15 mins

export default function MockTests() {
  const [selectedTopic,    setSelectedTopic]    = useState('dsa');
  const [selectedDiff,     setSelectedDiff]     = useState('mixed');
  const [testState,        setTestState]        = useState('overview'); // overview | testing | result
  const [questions,        setQuestions]        = useState([]);
  const [currentIdx,       setCurrentIdx]       = useState(0);
  const [answers,          setAnswers]          = useState({});
  const [flagged,          setFlagged]          = useState({});
  const [timeLeft,         setTimeLeft]         = useState(0);
  const [loading,          setLoading]          = useState(false);
  const [score,            setScore]            = useState(0);
  const [correctCount,     setCorrectCount]     = useState(0);
  const [history,          setHistory]          = useState([]);
  const [showReview,       setShowReview]       = useState(false);
  const [reviewIdx,        setReviewIdx]        = useState(0);

  // Fetch history on mount
  useEffect(() => {
    api.get('/tests/history').then(r => setHistory(r.data)).catch(() => {});
  }, []);

  // Countdown timer
  const submitTest = useCallback(async (qs, ans) => {
    let correct = 0;
    qs.forEach((q, i) => { if (ans[i] === q.correctAnswer) correct++; });
    const finalScore = Math.round((correct / qs.length) * 100);
    setScore(finalScore);
    setCorrectCount(correct);
    setTestState('result');
    try {
      await api.post('/tests/submit', {
        category: selectedTopic,
        score: finalScore,
        totalQuestions: qs.length,
        correctCount: correct,
        difficulty: selectedDiff,
        duration: `${Math.round((qs.length * TIME_PER_QUESTION) / 60)} mins`
      });
      const hRes = await api.get('/tests/history');
      setHistory(hRes.data);
    } catch (e) { console.error('Submit error', e); }
  }, [selectedTopic, selectedDiff]);

  useEffect(() => {
    if (testState !== 'testing') return;
    if (timeLeft <= 0) { submitTest(questions, answers); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [testState, timeLeft, questions, answers, submitTest]);

  const startTest = async () => {
    setLoading(true);
    try {
      const url = selectedDiff === 'mixed'
        ? `/tests/questions/${selectedTopic}`
        : `/tests/questions/${selectedTopic}?difficulty=${selectedDiff}`;
      const res = await api.get(url);
      if (!res.data.length) {
        alert('No questions found for this selection. Try a different filter.');
        setLoading(false);
        return;
      }
      setQuestions(res.data);
      setTimeLeft(res.data.length * TIME_PER_QUESTION);
      setTestState('testing');
      setCurrentIdx(0);
      setAnswers({});
      setFlagged({});
      setShowReview(false);
    } catch (e) {
      alert('Failed to start test. Is the backend running?');
    }
    setLoading(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const timerColor = timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#f59e0b' : 'var(--primary)';

  // ── Test Environment ──────────────────────────────────────────────────────
  if (testState === 'testing') {
    const q = questions[currentIdx];
    const diff = difficultyConfig[q.difficulty] || difficultyConfig.medium;
    const DiffIcon = diff.icon;
    const answered = Object.keys(answers).length;

    return (
      <div className="test-environment animate-fade-in">
        {/* Top Bar */}
        <div className="test-top-bar">
          <div className="ttb-left">
            <div className="topic-badge glass-panel">
              <BrainCircuit size={16} />
              {testCategories.find(c => c.id === selectedTopic)?.name}
            </div>
            <div className="answered-pill">
              <Target size={14} /> {answered}/{questions.length} answered
            </div>
          </div>
          <div className="test-timer glass-panel" style={{ color: timerColor }}>
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="q-navigator glass-panel">
          {questions.map((_, i) => (
            <button
              key={i}
              className={`qn-dot ${answers[i] !== undefined ? 'answered' : ''} ${flagged[i] ? 'flagged' : ''} ${i === currentIdx ? 'current' : ''}`}
              onClick={() => setCurrentIdx(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question Panel */}
        <div className="q-panel glass-panel mt-4">
          <div className="q-header">
            <div className="q-meta">
              <span className="q-num-badge">Q{currentIdx + 1} of {questions.length}</span>
              <div className="difficulty-badge" style={{ color: diff.color, background: diff.bg }}>
                <DiffIcon size={13} />
                {diff.label}
                <span className="diff-pts">+{diff.points} pts</span>
              </div>
              {q.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="tag-chip">#{tag}</span>
              ))}
            </div>
            <div className="q-progress-bar">
              <div className="q-progress-fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
            </div>
          </div>

          <h2 className="q-text mt-5">{q.text}</h2>

          <div className="options-grid mt-6">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`opt-btn ${answers[currentIdx] === i ? 'selected' : ''}`}
                onClick={() => setAnswers({ ...answers, [currentIdx]: i })}
              >
                <span className="opt-idx">{String.fromCharCode(65 + i)}</span>
                <span className="opt-label">{opt}</span>
                {answers[currentIdx] === i && <CheckCircle size={18} className="opt-check" />}
              </button>
            ))}
          </div>

          <div className="q-actions mt-8">
            <div className="q-actions-left">
              <button
                className="btn btn-ghost border-btn"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx(p => p - 1)}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                className={`flag-btn ${flagged[currentIdx] ? 'flagged' : ''}`}
                onClick={() => setFlagged({ ...flagged, [currentIdx]: !flagged[currentIdx] })}
                title="Flag for review"
              >
                <AlertCircle size={16} />
                {flagged[currentIdx] ? 'Flagged' : 'Flag'}
              </button>
            </div>
            {currentIdx < questions.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setCurrentIdx(p => p + 1)}>
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button className="btn btn-success finish-btn" onClick={() => submitTest(questions, answers)}>
                <Trophy size={16} /> Finish Test
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Result + Review Screen ────────────────────────────────────────────────
  if (testState === 'result') {
    if (showReview) {
      const q = questions[reviewIdx];
      const userAns = answers[reviewIdx];
      const isCorrect = userAns === q.correctAnswer;
      const diff = difficultyConfig[q.difficulty] || difficultyConfig.medium;
      const DiffIcon = diff.icon;

      return (
        <div className="review-env animate-fade-in">
          <div className="review-header">
            <button className="btn btn-ghost border-btn" onClick={() => setShowReview(false)}>
              ← Back to Results
            </button>
            <span className="review-qq">Reviewing Q{reviewIdx + 1} / {questions.length}</span>
          </div>

          <div className="q-panel glass-panel mt-4">
            <div className="q-meta">
              <div className="difficulty-badge" style={{ color: diff.color, background: diff.bg }}>
                <DiffIcon size={13} /> {diff.label}
              </div>
              {q.tags?.slice(0, 3).map(t => <span key={t} className="tag-chip">#{t}</span>)}
            </div>

            <h2 className="q-text mt-5">{q.text}</h2>

            <div className="options-grid mt-6">
              {q.options.map((opt, i) => (
                <div
                  key={i}
                  className={`opt-btn review-opt
                    ${i === q.correctAnswer ? 'correct-ans' : ''}
                    ${i === userAns && !isCorrect ? 'wrong-ans' : ''}
                  `}
                >
                  <span className="opt-idx">{String.fromCharCode(65 + i)}</span>
                  <span className="opt-label">{opt}</span>
                  {i === q.correctAnswer && <CheckCircle size={18} className="opt-check" style={{ color: '#10b981' }} />}
                  {i === userAns && !isCorrect && <XCircle size={18} className="opt-check" style={{ color: '#ef4444' }} />}
                </div>
              ))}
            </div>

            {userAns === undefined && (
              <div className="skipped-note">⚠ You skipped this question.</div>
            )}

            <div className="q-actions mt-6">
              <button className="btn btn-ghost border-btn" disabled={reviewIdx === 0} onClick={() => setReviewIdx(p => p - 1)}>
                <ChevronLeft size={16} /> Prev
              </button>
              {reviewIdx < questions.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setReviewIdx(p => p + 1)}>
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn btn-ghost border-btn" onClick={() => setShowReview(false)}>
                  Done Reviewing
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    const wrongCount = questions.length - correctCount - Object.keys(answers).filter(k => answers[k] === undefined).length;
    const skipped = questions.filter((_, i) => answers[i] === undefined).length;
    const totalPts = questions.reduce((sum, q, i) => {
      return answers[i] === q.correctAnswer
        ? sum + (difficultyConfig[q.difficulty]?.points || 20)
        : sum;
    }, 0);

    return (
      <div className="result-view animate-fade-in">
        <div className="result-card glass-panel">
          <div className="result-trophy">
            <Trophy size={56} color={score >= 80 ? '#f59e0b' : score >= 60 ? '#818cf8' : '#94a3b8'} />
          </div>
          <h1 className="result-title">
            {score >= 80 ? '🎉 Excellent!' : score >= 60 ? '👍 Good Job!' : '💪 Keep Practising!'}
          </h1>
          <p className="text-muted">{testCategories.find(c => c.id === selectedTopic)?.name} Assessment</p>

          {/* Score Ring */}
          <div className="score-ring mt-6">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" strokeDasharray={`${score}, 100`}
                stroke={score >= 80 ? '#10b981' : score >= 60 ? '#818cf8' : '#ef4444'}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <text x="18" y="20.35" className="percentage">{score}%</text>
            </svg>
          </div>

          {/* Breakdown */}
          <div className="result-breakdown mt-6">
            <div className="rbd-item correct">
              <CheckCircle size={20} color="#10b981" />
              <span className="rbd-val">{correctCount}</span>
              <span className="rbd-lbl">Correct</span>
            </div>
            <div className="rbd-item wrong">
              <XCircle size={20} color="#ef4444" />
              <span className="rbd-val">{questions.length - correctCount - skipped}</span>
              <span className="rbd-lbl">Wrong</span>
            </div>
            <div className="rbd-item skipped">
              <AlertCircle size={20} color="#f59e0b" />
              <span className="rbd-val">{skipped}</span>
              <span className="rbd-lbl">Skipped</span>
            </div>
            <div className="rbd-item points">
              <Star size={20} color="#818cf8" />
              <span className="rbd-val">{totalPts}</span>
              <span className="rbd-lbl">Points</span>
            </div>
          </div>

          {/* Per-difficulty breakdown */}
          <div className="diff-breakdown mt-6">
            {['easy', 'medium', 'hard'].map(d => {
              const dQs = questions.filter(q => q.difficulty === d);
              if (!dQs.length) return null;
              const dCorrect = dQs.filter((q, _) => answers[questions.indexOf(q)] === q.correctAnswer).length;
              const cfg = difficultyConfig[d];
              const DIcon = cfg.icon;
              return (
                <div key={d} className="diff-row">
                  <div className="diff-label" style={{ color: cfg.color }}>
                    <DIcon size={14} /> {cfg.label}
                  </div>
                  <div className="diff-bar-track">
                    <div className="diff-bar-fill" style={{ width: `${(dCorrect / dQs.length) * 100}%`, background: cfg.color }} />
                  </div>
                  <span className="diff-score">{dCorrect}/{dQs.length}</span>
                </div>
              );
            })}
          </div>

          <div className="result-actions mt-8">
            <button className="btn btn-primary" onClick={() => { setShowReview(true); setReviewIdx(0); }}>
              <BookOpen size={16} /> Review Answers
            </button>
            <button className="btn btn-ghost border-btn" onClick={startTest}>
              <RefreshCw size={16} /> Retake
            </button>
            <button className="btn btn-ghost border-btn" onClick={() => setTestState('overview')}>
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Overview / Home Screen ────────────────────────────────────────────────
  return (
    <div className="tests-container animate-fade-in">
      <div className="tests-header">
        <div>
          <h1 className="tests-heading">Mock <span className="gradient-text">Test Arena</span></h1>
          <p className="tests-subheading">10 adaptive questions per test · Easy, Medium & Hard difficulties</p>
        </div>
      </div>

      <div className="tests-grid">
        {/* Left — Test Generator */}
        <div className="tests-main">
          <div className="panel glass-panel gen-panel animate-fade-in">
            <h3 className="panel-title mb-6"><PlayCircle size={20} /> Configure New Test</h3>

            <div className="gen-form">
              {/* Category Picker */}
              <div className="form-group">
                <label>Select Category</label>
                <div className="category-chips">
                  {testCategories.map(cat => (
                    <button
                      key={cat.id}
                      className={`cat-chip ${selectedTopic === cat.id ? 'active' : ''}`}
                      style={selectedTopic === cat.id ? { borderColor: cat.color, background: `${cat.color}22` } : {}}
                      onClick={() => setSelectedTopic(cat.id)}
                    >
                      <cat.icon size={14} /> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Picker */}
              <div className="form-group">
                <label><Filter size={13} style={{ marginRight: 5 }} />Difficulty Filter</label>
                <div className="diff-chips">
                  {[{ id: 'mixed', label: '⚡ Mixed (Recommended)', color: '#818cf8' },
                    { id: 'easy',   label: '⭐ Easy Only',          color: '#10b981' },
                    { id: 'medium', label: '⚡ Medium Only',        color: '#f59e0b' },
                    { id: 'hard',   label: '🔥 Hard Only',          color: '#ef4444' }
                  ].map(d => (
                    <button
                      key={d.id}
                      className={`diff-filter-btn ${selectedDiff === d.id ? 'active' : ''}`}
                      style={selectedDiff === d.id ? { borderColor: d.color, background: `${d.color}22`, color: d.color } : {}}
                      onClick={() => setSelectedDiff(d.id)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Strip */}
              <div className="test-info-strip">
                <div className="ti-item"><Clock size={14} /> ~15 min</div>
                <div className="ti-item"><Target size={14} /> 10 Questions</div>
                <div className="ti-item"><Star size={14} /> Up to 220 pts</div>
                <div className="ti-item">
                  <span className="diff-dot easy" /> Easy: +10
                  <span className="diff-dot medium" /> Med: +20
                  <span className="diff-dot hard" /> Hard: +30
                </div>
              </div>

              <button
                className="btn btn-primary start-test-btn mt-2"
                onClick={startTest}
                disabled={loading}
              >
                {loading ? 'Preparing Questions...' : <><PlayCircle size={18} /> Start Test</>}
              </button>
            </div>
          </div>

          {/* Quick Practice Cards */}
          <h3 className="section-title mt-6 mb-4">Quick Practice Modules</h3>
          <div className="modules-grid animate-fade-in">
            {testCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="module-card glass-panel"
                  onClick={() => { setSelectedTopic(cat.id); setSelectedDiff('mixed'); startTest(); }}
                >
                  <div className="mc-icon-wrapper" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                    <Icon size={24} />
                  </div>
                  <h4>{cat.name}</h4>
                  <p>{cat.count} questions · Mixed difficulty</p>
                  <div className="mc-difficulty-row">
                    <span className="mcd-badge easy">3 Easy</span>
                    <span className="mcd-badge medium">4 Medium</span>
                    <span className="mcd-badge hard">3 Hard</span>
                  </div>
                  <div className="mc-footer">
                    <span className="mc-time"><Clock size={13} /> ~15 mins</span>
                    <button className="btn btn-ghost border-btn sm-btn">Start →</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — Stats & History */}
        <div className="tests-side">
          {/* Performance */}
          <div className="panel glass-panel gradient-border-panel animate-fade-in">
            <h3 className="panel-title mb-4"><Award size={18} color="var(--primary)" /> Performance Stats</h3>
            {history.length > 0 ? (
              <>
                <div className="perf-stats">
                  <div className="perf-item">
                    <span className="perf-val">
                      {Math.round(history.reduce((s, h) => s + h.score, 0) / history.length)}%
                    </span>
                    <span className="perf-lbl">Avg Score</span>
                  </div>
                  <div className="perf-item">
                    <span className="perf-val">{history.length}</span>
                    <span className="perf-lbl">Tests Taken</span>
                  </div>
                </div>
                <div className="perf-bars mt-4">
                  {testCategories.map(cat => {
                    const catTests = history.filter(h => h.category === cat.id);
                    if (!catTests.length) return null;
                    const avg = Math.round(catTests.reduce((s, h) => s + h.score, 0) / catTests.length);
                    return (
                      <div key={cat.id} className="pb-row">
                        <div className="pb-info">
                          <span>{cat.name.split(' ')[0]}</span>
                          <span>{avg}%</span>
                        </div>
                        <div className="pb-track">
                          <div className="pb-fill" style={{ width: `${avg}%`, background: cat.color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="no-data-msg">No tests taken yet. Start your first test!</p>
            )}
          </div>

          {/* Recent History */}
          <div className="panel glass-panel mt-4 animate-fade-in">
            <div className="panel-header mb-4">
              <h3 className="panel-title"><History size={18} /> Recent Assessments</h3>
            </div>
            <div className="test-history-list">
              {history.length > 0 ? history.slice(0, 6).map(test => {
                const scoreColor = test.score >= 80 ? '#10b981' : test.score >= 60 ? '#818cf8' : '#ef4444';
                const scoreBg   = test.score >= 80 ? 'rgba(16,185,129,0.1)' : test.score >= 60 ? 'rgba(129,140,248,0.1)' : 'rgba(239,68,68,0.1)';
                return (
                  <div key={test._id} className="th-item">
                    <div className="th-info">
                      <h4>{test.category.toUpperCase()} Assessment</h4>
                      <span>{new Date(test.completedAt).toLocaleDateString()} · {test.duration || '—'}</span>
                    </div>
                    <div className="score-badge" style={{ color: scoreColor, background: scoreBg }}>
                      {test.score}%
                    </div>
                  </div>
                );
              }) : (
                <p className="no-data-msg">No history yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
