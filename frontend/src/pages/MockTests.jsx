import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  BrainCircuit, PlayCircle, Timer, CheckCircle, Settings,
  History, BarChart2, Clock, Award, ChevronRight, ChevronLeft,
  Flame, Star, Zap, RefreshCw, Filter, Trophy, Target,
  AlertCircle, XCircle, BookOpen, Lightbulb, ZapOff, Languages,
  ChevronDown
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  PieChart, Pie
} from 'recharts';
import './MockTests.css';
import api from '../utils/api';

const testCategories = [
  { id: 'dsa',              name: 'DSA & Algorithms', icon: BrainCircuit, color: '#818cf8', count: 30 },
  { id: 'sysdesign',        name: 'System Design',    icon: Settings,     color: '#38bdf8', count: 30 },
  { id: 'csCore',           name: 'CS Core Concepts', icon: BarChart2,    color: '#c084fc', count: 30 },
  { id: 'aptitude',         name: 'Quant Aptitude',   icon: Timer,        color: '#fca5a5', count: 30 },
  { id: 'logicalReasoning', name: 'Logical Reasoning', icon: Lightbulb,    color: '#fbbf24', count: 30 },
  { id: 'verbalAbility',    name: 'Verbal Ability',   icon: Languages,    color: '#2dd4bf', count: 30 },
];

const difficultyConfig = {
  easy:   { label: 'Easy',   color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: Star,  points: 10, benchmark: 45 },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: Zap,   points: 20, benchmark: 90 },
  hard:   { label: 'Hard',   color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  icon: Flame, points: 30, benchmark: 150 },
};

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
  const [history,          setHistory]          = useState([]);
  const [showReview,       setShowReview]       = useState(false);
  const [reviewIdx,        setReviewIdx]        = useState(0);
  const [testStats,        setTestStats]        = useState(null);
  const [statsSummary,     setStatsSummary]     = useState({
    avgScore: 0,
    totalTests: 0,
    categoryStats: {}
  });

  const lastTimeRef = useRef(null);

  // Fetch history and calculate summary
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/tests/history');
        const historyData = res.data || [];
        setHistory(historyData);
        
        if (historyData.length > 0) {
          const total = historyData.length;
          const avg = Math.round(historyData.reduce((acc, curr) => acc + curr.score, 0) / total);
          
          const catMap = {};
          historyData.forEach(test => {
            if (!catMap[test.category]) catMap[test.category] = { sum: 0, count: 0 };
            catMap[test.category].sum += test.score;
            catMap[test.category].count += 1;
          });
          
          const categoryStats = {};
          Object.keys(catMap).forEach(cat => {
            categoryStats[cat] = Math.round(catMap[cat].sum / catMap[cat].count);
          });
          
          setStatsSummary({
            avgScore: avg,
            totalTests: total,
            categoryStats
          });
        }
      } catch (err) {
        console.error('History fetch error:', err);
      }
    };
    fetchHistory();
  }, []);

  const submitTest = useCallback(async (qs, ans) => {
    // Calculate metrics
    let correct = 0;
    let totalPoints = 0;
    let maxPoints = 0;
    const questionDetails = qs.map((q, i) => {
      const isCorrect = ans[i] === q.correctAnswer;
      const pts = difficultyConfig[q.difficulty].points;
      maxPoints += pts;
      if (isCorrect) {
        correct++;
        totalPoints += pts;
      }
      return {
        questionId: q._id,
        questionText: q.text,
        timeSpent: q.timeSpentSpent || 0, // Should be filled during test
        efficientTime: q.efficientTime || (q.difficulty === 'easy' ? 45 : q.difficulty === 'medium' ? 90 : 150),
        isCorrect,
        wasSkipped: ans[i] === undefined,
        selectedOption: ans[i],
        correctOption: q.correctAnswer,
        difficulty: q.difficulty,
        pointsEarned: isCorrect ? pts : 0,
        maxPoints: pts
      };
    });

    const finalScore = Math.round((correct / qs.length) * 100);
    const resultData = {
      category: selectedTopic,
      score: finalScore,
      totalQuestions: qs.length,
      correctCount: correct,
      totalPoints,
      maxPoints,
      difficulty: selectedDiff,
      duration: `${Math.floor((qs.length * (qs.difficulty === 'easy' ? 45 : 90)) / 60)} mins`,
      questionDetails
    };

    setTestStats(resultData);
    setTestState('result');

    try {
      await api.post('/tests/submit', resultData);
      const hRes = await api.get('/tests/history');
      setHistory(hRes.data);
    } catch (e) { console.error('Submit error', e); }
  }, [selectedTopic, selectedDiff]);

  // Global countdown
  useEffect(() => {
    if (testState !== 'testing') return;
    if (timeLeft <= 0) { submitTest(questions, answers); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [testState, timeLeft, questions, answers, submitTest]);

  // Track time per question
  useEffect(() => {
    if (testState !== 'testing' || !questions.length) return;
    
    // Mark current question start time
    lastTimeRef.current = Date.now();

    return () => {
      if (lastTimeRef.current) {
        const spent = Math.round((Date.now() - lastTimeRef.current) / 1000);
        setQuestions(prev => {
          const updated = [...prev];
          if (updated[currentIdx]) {
            updated[currentIdx].timeSpentSpent = (updated[currentIdx].timeSpentSpent || 0) + spent;
          }
          return updated;
        });
      }
    };
  }, [currentIdx, testState, questions.length]);

  const startTest = async () => {
    setLoading(true);
    try {
      const url = `/tests/questions/${selectedTopic}${selectedDiff !== 'mixed' ? `?difficulty=${selectedDiff}` : ''}`;
      const res = await api.get(url);
      if (!res.data.length) {
        alert('Insufficient questions in this category pool.');
        setLoading(false);
        return;
      }
      
      // Initialize questions with timeSpentSpent = 0
      const initializedQs = res.data.map(q => ({ ...q, timeSpentSpent: 0 }));
      setQuestions(initializedQs);
      
      // 25 questions * 75s avg = ~30 mins
      setTimeLeft(initializedQs.length * 90); 
      setTestState('testing');
      setCurrentIdx(0);
      setAnswers({});
      setFlagged({});
      setShowReview(false);
      setTestStats(null);
    } catch (e) {
      alert('Failed to start test. Please try again.');
    }
    setLoading(false);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  // ── Testing Environment ───────────────────────────────────────────────────
  if (testState === 'testing') {
    const q = questions[currentIdx];
    const diff = difficultyConfig[q.difficulty] || difficultyConfig.medium;
    const DiffIcon = diff.icon;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="test-environment animate-fade-in">
        <div className="test-top-bar glass-panel">
          <div className="ttb-left">
            <div className="category-meta" style={{ color: testCategories.find(c => c.id === selectedTopic)?.color }}>
              {React.createElement(testCategories.find(c => c.id === selectedTopic)?.icon || BrainCircuit, { size: 18 })}
              <span>{testCategories.find(c => c.id === selectedTopic)?.name}</span>
            </div>
            <div className="answered-pill">
              <Target size={14} /> {answeredCount}/{questions.length} Completed
            </div>
          </div>
          <div className="test-timer-wrapper" style={{ color: timeLeft < 60 ? '#ef4444' : 'inherit' }}>
            <Timer size={18} />
            <span className="mono-timer">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="test-main-layout">
          {/* Main Question Area */}
          <div className="q-panel-container">
            <div className="q-navigator-row glass-panel mb-4">
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

            <div className="q-panel glass-panel">
              <div className="q-header-meta">
                <span className="q-index">Question {currentIdx + 1} of {questions.length}</span>
                <div className="difficulty-tag" style={{ color: diff.color, background: diff.bg }}>
                  <DiffIcon size={14} />
                  {diff.label} | +{diff.points} pts
                </div>
                {q.tags?.map(t => <span key={t} className="tag-pill">#{t}</span>)}
              </div>

              <div className="q-body mt-6">
                <h2 className="q-text">{q.text}</h2>
                
                <div className="options-container mt-8">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      className={`option-card ${answers[currentIdx] === i ? 'selected' : ''}`}
                      onClick={() => setAnswers({ ...answers, [currentIdx]: i })}
                    >
                      <div className="opt-marker">{String.fromCharCode(65 + i)}</div>
                      <div className="opt-content">{opt}</div>
                      {answers[currentIdx] === i && <CheckCircle className="opt-select-icon" size={20} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="test-footer mt-10">
                <div className="footer-left">
                  <button 
                    className="btn btn-ghost border-btn" 
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(p => p - 1)}
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button 
                    className={`flag-toggle ${flagged[currentIdx] ? 'active' : ''}`}
                    onClick={() => setFlagged({ ...flagged, [currentIdx]: !flagged[currentIdx] })}
                  >
                    <Star size={16} /> {flagged[currentIdx] ? 'Flagged' : 'Flag'}
                  </button>
                </div>

                <div className="footer-right">
                  {currentIdx < questions.length - 1 ? (
                    <button className="btn btn-primary" onClick={() => setCurrentIdx(p => p + 1)}>
                      Next Question <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button className="btn btn-success shine-btn" onClick={() => submitTest(questions, answers)}>
                      <Trophy size={16} /> Finalize Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Result View ───────────────────────────────────────────────────────────
  if (testState === 'result' && testStats) {
    if (showReview) {
      const q = questions[reviewIdx];
      const userAns = answers[reviewIdx];
      const isCorrect = userAns === q.correctAnswer;
      const spent = q.timeSpentSpent || 0;
      const benchmark = q.efficientTime || (q.difficulty === 'easy' ? 45 : q.difficulty === 'medium' ? 90 : 150);

      return (
        <div className="review-environment animate-fade-in">
          <div className="review-header glass-panel">
            <button className="btn btn-ghost border-btn" onClick={() => setShowReview(false)}>
              <ChevronLeft size={16} /> Back to Insights
            </button>
            <div className="review-progress">Reviewing {reviewIdx + 1} / {questions.length}</div>
          </div>

          <div className="q-panel glass-panel mt-4">
            <div className="q-header-meta">
              <div className="difficulty-tag" style={{ color: difficultyConfig[q.difficulty].color, background: difficultyConfig[q.difficulty].bg }}>
                {q.difficulty.toUpperCase()}
              </div>
              <div className={`time-status-pill ${spent > benchmark ? 'slow' : 'fast'}`}>
                {spent > benchmark ? <ZapOff size={14}/> : <Zap size={14}/>}
                {spent}s taken (Goal: {benchmark}s)
              </div>
            </div>

            <h2 className="q-text mt-6">{q.text}</h2>

            <div className="options-container mt-8">
              {q.options.map((opt, i) => (
                <div
                  key={i}
                  className={`option-card review-mode 
                    ${i === q.correctAnswer ? 'correct' : ''} 
                    ${i === userAns && !isCorrect ? 'incorrect' : ''}
                  `}
                >
                  <div className="opt-marker">{String.fromCharCode(65 + i)}</div>
                  <div className="opt-content">{opt}</div>
                  {i === q.correctAnswer && <CheckCircle size={20} color="#10b981" />}
                  {i === userAns && !isCorrect && <XCircle size={20} color="#ef4444" />}
                </div>
              ))}
            </div>

            <div className="test-footer mt-10">
              <button 
                className="btn btn-ghost border-btn" 
                disabled={reviewIdx === 0}
                onClick={() => setReviewIdx(p => p - 1)}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              {reviewIdx < questions.length - 1 ? (
                <button className="btn btn-primary" onClick={() => setReviewIdx(p => p + 1)}>
                   Next <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn btn-success" onClick={() => setShowReview(false)}>Done</button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Process graph data
    const chartData = testStats.questionDetails.map((d, i) => ({
      name: `Q${i+1}`,
      spent: d.timeSpent,
      goal: d.efficientTime,
      correct: d.isCorrect ? 1 : 0
    }));

    const difficultyData = ['easy', 'medium', 'hard'].map(d => {
      const dQs = testStats.questionDetails.filter(q => q.difficulty === d);
      return { 
        name: d.toUpperCase(), 
        correct: dQs.filter(q => q.isCorrect).length, 
        total: dQs.length 
      };
    }).filter(d => d.total > 0);

    // Improvement Advide
    const weakTags = [...new Set(questions.filter((q, i) => answers[i] !== q.correctAnswer).flatMap(q => q.tags))].slice(0, 3);

    return (
      <div className="result-arena animate-fade-in">
        <div className="result-main-card glass-panel text-center">
          <div className="result-badge-container">
            <div className={`result-score-ring ${testStats.score >= 80 ? 'gold' : testStats.score >= 60 ? 'blue' : 'red'}`}>
              <span className="score-num">{testStats.score}%</span>
              <span className="score-lbl">Score</span>
            </div>
            <Trophy className="floating-trophy" size={48} color={testStats.score >= 80 ? '#fbbf24' : '#94a3b8'} />
          </div>

          <h2 className="result-hero-text mt-4">
            {testStats.score >= 80 ? 'Mastery Achieved!' : testStats.score >= 60 ? 'Stolid Performance' : 'Growth Mindset Needed'}
          </h2>
          <p className="text-secondary">{testCategories.find(c => c.id === selectedTopic)?.name} Assessment · {questions.length} Questions</p>

          <div className="analytics-grid-row mt-8">
            <div className="analytic-box">
              <Target size={20} color="#10b981" />
              <h3>{testStats.correctCount} / {questions.length}</h3>
              <p>Accuracy</p>
            </div>
            <div className="analytic-box">
              <Star size={20} color="#fbbf24" />
              <h3>{testStats.totalPoints} / {testStats.maxPoints}</h3>
              <p>Points Earned</p>
            </div>
            <div className="analytic-box">
              <Clock size={20} color="#38bdf8" />
              <h3>{Math.round(testStats.questionDetails.reduce((a,b) => a + b.timeSpent, 0) / questions.length)}s</h3>
              <p>Avg Time / Q</p>
            </div>
          </div>
        </div>

        <div className="analytics-details-grid mt-6">
          {/* Time Analysis Chart */}
          <div className="panel glass-panel">
            <h3 className="panel-title mb-6"><BarChart2 size={18} /> Time Taken vs. Target Benchmark</h3>
            <div style={{ width: '100%', height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} label={{ value: 'Sec', angle: -90, position: 'insideLeft' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.9)', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="spent" name="Spent" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.spent > entry.goal ? '#f87171' : '#34d399'} />
                    ))}
                  </Bar>
                  <Bar dataKey="goal" name="Target" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Proficiency by Difficulty */}
          <div className="panel glass-panel">
            <h3 className="panel-title mb-6"><History size={18} /> Accuracy by Difficulty</h3>
            <div className="prof-list">
              {difficultyData.map(d => (
                <div key={d.name} className="prof-row">
                  <div className="prof-meta">
                    <span>{d.name}</span>
                    <span>{Math.round((d.correct / d.total) * 100)}%</span>
                  </div>
                  <div className="prof-track">
                    <div 
                      className="prof-fill" 
                      style={{ 
                        width: `${(d.correct / d.total) * 100}%`,
                        background: d.name === 'HARD' ? '#ef4444' : d.name === 'MEDIUM' ? '#f59e0b' : '#10b981'
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="insights-panel mt-6">
              <div className="insight-header">
                <Lightbulb size={18} color="#fbbf24" />
                <span>Improvement Strategy</span>
              </div>
              <p className="insight-text">
                Focus on these core topics to boost your score: {weakTags.length > 0 ? weakTags.join(', ') : 'Maintain current momentum!'}
              </p>
            </div>
          </div>
        </div>

        <div className="result-actions mt-8">
          <button className="btn btn-primary" onClick={() => { setShowReview(true); setReviewIdx(0); }}>
            <BookOpen size={18} /> Detailed Question Review
          </button>
          <button className="btn btn-ghost border-btn" onClick={startTest}>
            <RefreshCw size={18} /> Retake Test
          </button>
          <button className="btn btn-ghost border-btn" onClick={() => setTestState('overview')}>
            Exit Arena
          </button>
        </div>
      </div>
    );
  }

  // ── Overview Screen ───────────────────────────────────────────────────────
  return (
    <div className="tests-container animate-fade-in">
      <div className="hero-section">
        <h1 className="hero-title">Mock <span className="gradient-text">Test Arena</span></h1>
        <p className="hero-subtitle">Adaptive 25-question simulations across 6 specialized domains</p>
      </div>

      <div className="arena-grid">
        <div className="arena-main">
          <div className="config-panel glass-panel animate-fade-in">
            <h3 className="panel-title mb-8"><PlayCircle size={20} /> Deploy New Simulation</h3>
            
            <div className="config-group">
              <label>Select Your Domain</label>
              <div className="domain-grid">
                {testCategories.map(cat => (
                  <button
                    key={cat.id}
                    className={`domain-card ${selectedTopic === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedTopic(cat.id)}
                    style={selectedTopic === cat.id ? { '--domain-color': cat.color } : {}}
                  >
                    <div className="domain-icon" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                      {React.createElement(cat.icon, { size: 20 })}
                    </div>
                    <span className="domain-name">{cat.name}</span>
                    {selectedTopic === cat.id && <ChevronDown size={14} className="active-down" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="config-group mt-8">
              <label><Filter size={14} /> Difficulty Mode</label>
              <div className="diff-toggle-row">
                {[
                  { id: 'mixed', label: 'Adaptive Mixed', desc: 'Standard placement mix' },
                  { id: 'easy',   label: 'Warmup (Easy)',  desc: 'Focus on fundamentals' },
                  { id: 'medium', label: 'Skilled (Med)',  desc: 'Core interview level' },
                  { id: 'hard',   label: 'Expert (Hard)',  desc: 'Competitive coding' }
                ].map(d => (
                  <button
                    key={d.id}
                    className={`diff-toggle-btn ${selectedDiff === d.id ? 'active' : ''}`}
                    onClick={() => setSelectedDiff(d.id)}
                  >
                    <span className="toggle-label">{d.label}</span>
                    <span className="toggle-desc">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="test-primer mt-8">
              <div className="primer-stat"><Clock size={16}/> 25 Questions</div>
              <div className="primer-stat"><Timer size={16}/> ~35 Mins</div>
              <div className="primer-stat"><Award size={16}/> Up to 750 Pts</div>
              <button 
                className="btn btn-primary start-arena-btn" 
                onClick={startTest}
                disabled={loading}
              >
                {loading ? 'Initializing...' : <><PlayCircle size={20}/> Begin Assessment</>}
              </button>
            </div>
          </div>

          <h3 className="section-title mt-10 mb-6">Simulation Modules</h3>
          <div className="quick-modules-grid">
             {testCategories.map(cat => (
               <div key={cat.id} className="arena-module-card glass-panel" onClick={() => { setSelectedTopic(cat.id); startTest(); }}>
                  <div className="amc-header">
                    <div className="amc-icon" style={{ color: cat.color }}>{React.createElement(cat.icon, { size: 24 })}</div>
                    <div className="amc-badge">NEW questions pool</div>
                  </div>
                  <h4>{cat.name}</h4>
                  <div className="amc-meta">30 Questions · {cat.id === 'dsa' ? 'High frequency' : 'Comprehensive'}</div>
                  <div className="amc-footer">
                    <span className="amc-pts">+750 MAX</span>
                    <button className="amc-btn">Launch →</button>
                  </div>
               </div>
             ))}
          </div>
        </div>

<<<<<<< HEAD
        {/* Right Col - Stats & History */}
        <div className="tests-side">
          {/* Performance Overview */}
          <div className="panel glass-panel gradient-border-panel animate-fade-in stagger-3">
            <h3 className="panel-title mb-4"><Award size={18} color="var(--primary)" /> Performance Stats</h3>
            
            <div className="perf-stats">
              <div className="perf-item">
                <span className="perf-val">{statsSummary.avgScore}%</span>
                <span className="perf-lbl">Avg Score</span>
              </div>
              <div className="perf-item">
                <span className="perf-val">{statsSummary.totalTests}</span>
                <span className="perf-lbl">Tests Taken</span>
              </div>
            </div>

            <div className="perf-bars mt-4">
              {testCategories.map(cat => {
                const score = statsSummary.categoryStats[cat.id] || 0;
                return (
                  <div className="pb-row" key={cat.id}>
                    <div className="pb-info"><span>{cat.id.toUpperCase()}</span><span>{score}%</span></div>
                    <div className="pb-track">
                      <div 
                        className="pb-fill" 
                        style={{width: `${Math.max(5, score)}%`, background: cat.color}}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
=======
        <div className="arena-sidebar">
          <div className="sidebar-pnl glass-panel gradient-border">
            <h3 className="panel-title mb-6"><BarChart2 size={18} /> Global Rank Trends</h3>
            {history.length > 0 ? (
               <div className="rank-stats">
                  <div className="rank-main">
                    <span className="rank-val">{Math.round(history.reduce((a,b) => a + b.score, 0) / history.length)}%</span>
                    <span className="rank-lbl">Current PPG</span>
                  </div>
                  <div className="rank-track-list mt-6">
                    {testCategories.slice(0, 4).map(cat => {
                      const cTests = history.filter(h => h.category === cat.id);
                      const avg = cTests.length ? Math.round(cTests.reduce((a,b) => a + b.score, 0) / cTests.length) : 0;
                      return (
                        <div key={cat.id} className="rank-row">
                          <span className="rr-name">{cat.id.toUpperCase()}</span>
                          <div className="rr-track"><div className="rr-fill" style={{ width: `${avg}%`, background: cat.color }}/></div>
                          <span className="rr-val">{avg}%</span>
                        </div>
                      )
                    })}
                  </div>
               </div>
            ) : <p className="text-secondary text-center py-4">No simulations recorded yet.</p>}
>>>>>>> f3aa1c9562271b97bed949be46df9a5bd12ee8b9
          </div>

          <div className="sidebar-pnl glass-panel mt-6">
            <h3 className="panel-title mb-4"><History size={18} /> Recent Runs</h3>
            <div className="run-history">
              {history.slice(0, 5).map(h => (
                <div key={h._id} className="run-item">
                  <div className="run-meta">
                    <span className="run-cat">{h.category}</span>
                    <span className="run-date">{new Date(h.completedAt).toLocaleDateString()}</span>
                  </div>
                  <div className={`run-score ${h.score >= 80 ? 'hi' : h.score >= 60 ? 'mid' : 'lo'}`}>
                    {h.score}%
                  </div>
                </div>
              ))}
              {!history.length && <p className="text-secondary text-center">Empty</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

