import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  PlayCircle, 
  Timer, 
  CheckCircle, 
  Settings, 
  History, 
  BarChart, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react';
import './MockTests.css';

import api from '../utils/api';

const testCategories = [
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: BrainCircuit, color: '#818cf8', count: 45 },
  { id: 'sysdesign', name: 'System Design', icon: Settings, color: '#38bdf8', count: 12 },
  { id: 'csCore', name: 'CS Core (OS, DBMS, Networks)', icon: BarChart, color: '#c084fc', count: 28 },
  { id: 'aptitude', name: 'Quantitative Aptitude', icon: Timer, color: '#fca5a5', count: 50 }
];

export default function MockTests() {
  const [selectedTopic, setSelectedTopic] = useState('dsa');
  const [testState, setTestState] = useState('overview'); // overiew, testing, result
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [statsSummary, setStatsSummary] = useState({
    avgScore: 0,
    totalTests: 0,
    categoryStats: {}
  });

  React.useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/tests/history');
        const historyData = res.data || [];
        setHistory(historyData);
        
        // Calculate dynamic stats
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

  React.useEffect(() => {
    let timer;
    if (testState === 'testing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testState === 'testing') {
      submitTest();
    }
    return () => clearInterval(timer);
  }, [testState, timeLeft]);

  const startTest = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/tests/questions/${selectedTopic}`);
      if (res.data.length === 0) {
         alert('No questions found for this category. Seeding might be needed.');
         setLoading(false);
         return;
      }
      setQuestions(res.data);
      setTimeLeft(20 * 60); // 20 mins
      setTestState('testing');
      setCurrentIdx(0);
      setAnswers({});
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert('Failed to start test');
      setLoading(false);
    }
  };

  const submitTest = async () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctAnswer) correctCount++;
    });
    
    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setTestState('result');

    try {
      await api.post('/tests/submit', {
        category: selectedTopic,
        score: finalScore,
        totalQuestions: questions.length,
        duration: '20 mins'
      });
      // Refresh history
      const hRes = await api.get('/tests/history');
      setHistory(hRes.data);
    } catch (err) {
      console.error('Submit error:', err);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (testState === 'testing') {
    const q = questions[currentIdx];
    return (
      <div className="test-environment animate-fade-in">
        <div className="test-top">
          <div className="topic-badge glass-panel">
            <BrainCircuit size={18} /> {testCategories.find(c => c.id === selectedTopic)?.name}
          </div>
          <div className="test-timer glass-panel">
            <Clock size={18} color="var(--error)" /> <span>{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="test-body mt-6">
           <div className="panel glass-panel q-panel">
              <div className="q-header">
                <span className="q-num">Question {currentIdx + 1} of {questions.length}</span>
                <div className="progress-mini">
                   <div className="p-mini-fill" style={{width: `${((currentIdx+1)/questions.length)*100}%`}}></div>
                </div>
              </div>
              <h2 className="q-text mt-4">{q.text}</h2>
              
              <div className="options-grid mt-6">
                {q.options.map((opt, i) => (
                  <button 
                    key={i} 
                    className={`opt-btn glass-panel ${answers[currentIdx] === i ? 'selected' : ''}`}
                    onClick={() => setAnswers({...answers, [currentIdx]: i})}
                  >
                    <span className="opt-idx">{String.fromCharCode(65 + i)}</span>
                    <span className="opt-label">{opt}</span>
                  </button>
                ))}
              </div>

              <div className="q-actions mt-8">
                <button 
                   className="btn btn-ghost border-btn" 
                   disabled={currentIdx === 0}
                   onClick={() => setCurrentIdx(prev => prev - 1)}
                >
                  Previous
                </button>
                {currentIdx < questions.length - 1 ? (
                  <button className="btn btn-primary" onClick={() => setCurrentIdx(prev => prev + 1)}>
                    Next Question <ChevronRight size={18} />
                  </button>
                ) : (
                  <button className="btn btn-primary finish-btn" onClick={submitTest}>
                    Finish Assessment
                  </button>
                )}
              </div>
           </div>
        </div>
      </div>
    );
  }

  if (testState === 'result') {
    return (
      <div className="result-view animate-fade-in">
         <div className="panel glass-panel text-center p-12">
            <div className="result-icon-wrapper">
               <Award size={64} className="animate-pulse" color="var(--primary)" />
            </div>
            <h1 className="mt-6">Test Completed!</h1>
            <p className="text-muted">You scored {score}% in {selectedTopic.toUpperCase()} Assessment</p>
            
            <div className="score-ring mt-8">
               <svg viewBox="0 0 36 36" className="circular-chart">
                 <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                 <path className="circle" strokeDasharray={`${score}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                 <text x="18" y="20.35" className="percentage">{score}%</text>
               </svg>
            </div>

            <div className="result-actions mt-8">
               <button className="btn btn-primary" onClick={() => setTestState('overview')}>Back to Dashboard</button>
               <button className="btn btn-ghost ml-4 border-btn" onClick={() => startTest()}>Retake Test</button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="tests-container animate-fade-in stagger-1">
      <div className="tests-header">
        <div>
          <h1 className="tests-heading">AI-Powered <span className="gradient-text">Mock Tests</span></h1>
          <p className="tests-subheading">Generate adaptive assessments based on your target companies</p>
        </div>
      </div>

      <div className="tests-grid">
        {/* Left Col - Test Generator */}
        <div className="tests-main">
          <div className="panel glass-panel gen-panel animate-fade-in stagger-2">
            <h3 className="panel-title mb-6"><PlayCircle size={20} /> Generate New Assessment</h3>

            <div className="gen-form">
              <div className="form-group">
                <label>Select Target Company Pattern</label>
                <select className="test-select">
                  <option>Google (Hard DSA)</option>
                  <option>Amazon (Medium DSA + Leadership)</option>
                  <option>Microsoft (Standard DSA + CS Core)</option>
                  <option>Service-based (Aptitude + CS Core)</option>
                  <option>Custom Mix...</option>
                </select>
              </div>

              <div className="form-group">
                <label>Focus Areas</label>
                <div className="category-chips">
                  {testCategories.map(cat => (
                    <button 
                      key={cat.id} 
                      className={`cat-chip ${selectedTopic === cat.id ? 'active' : ''}`}
                      onClick={() => setSelectedTopic(cat.id)}
                    >
                      <cat.icon size={14} /> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group w-half">
                  <label>Duration</label>
                  <select className="test-select">
                    <option>30 Minutes</option>
                    <option>60 Minutes</option>
                    <option>90 Minutes</option>
                    <option>120 Minutes</option>
                  </select>
                </div>
                <div className="form-group w-half">
                  <label>Difficulty</label>
                  <select className="test-select">
                    <option>Adaptive (AI driven)</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              <button 
                className="btn btn-primary start-test-btn mt-4" 
                onClick={startTest} 
                disabled={loading}
              >
                {loading ? 'Preparing Questions...' : <><PlayCircle size={18} /> Start Test Environment</>}
              </button>
            </div>
          </div>

          {/* Quick Practice Modules */}
          <h3 className="section-title mt-6 mb-4">Quick Technical Modules</h3>
          <div className="modules-grid animate-fade-in stagger-3">
            {testCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div key={idx} className="module-card glass-panel transition-all">
                  <div className="mc-icon-wrapper" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                    <Icon size={24} />
                  </div>
                  <h4>{cat.name}</h4>
                  <p>{cat.count} question sets available</p>
                  <div className="mc-footer">
                    <span className="mc-time"><Clock size={14}/> 15 mins</span>
                    <button className="btn btn-ghost border-btn sm-btn">Practice</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

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
          </div>

          {/* Recent History */}
          <div className="panel glass-panel mt-6 animate-fade-in stagger-4">
            <div className="panel-header mb-4">
              <h3 className="panel-title"><History size={18} /> Recent Assessments</h3>
              <button className="btn-ghost panel-action text-sm">View All</button>
            </div>
            
            <div className="test-history-list">
              {history.length > 0 ? history.slice(0, 5).map(test => (
                <div key={test._id} className="th-item">
                  <div className="th-info">
                    <h4>{test.category.toUpperCase()} Assessment</h4>
                    <span>{new Date(test.completedAt).toLocaleDateString()} · {test.duration}</span>
                  </div>
                  <div className="th-score">
                    <div className="score-badge" style={{
                      color: test.score >= 90 ? 'var(--success)' : test.score >= 75 ? 'var(--primary)' : 'var(--warning)',
                      background: test.score >= 90 ? 'rgba(16,185,129,0.1)' : test.score >= 75 ? 'rgba(129,140,248,0.1)' : 'rgba(245,158,11,0.1)'
                    }}>
                      {test.score}%
                    </div>
                  </div>
                </div>
              )) : (
                <p className="no-data-msg">No tests taken yet. Start your first attempt!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
