import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, Trophy, BarChart2, TrendingUp, AlertCircle, RefreshCw, Zap, Target, BookOpen, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';
import './CPTracker.css';

const getPlatformRank = (rating) => {
  if (rating >= 2200) return 'Legendary';
  if (rating >= 2000) return 'Master';
  if (rating >= 1800) return 'Expert';
  if (rating >= 1600) return 'Specialist';
  if (rating >= 1400) return 'Pupil';
  return 'Rising';
};

const scoreFromTest = (test) => {
  const score = Number(test?.score || 0);
  const total = Math.max(1, Number(test?.total || 1));
  return Math.round((score / total) * 100);
};

const buildTrendPoints = (tests = []) => {
  if (tests.length === 0) return '0,25 20,20 40,28 60,15 80,10 100,12';
  if (tests.length === 1) {
    const score = scoreFromTest(tests[0]);
    return `0,25 100,${30 - Math.min(20, Math.max(0, score / 5))}`;
  }

  return tests.map((test, idx) => {
    const x = (idx / (tests.length - 1)) * 100;
    const y = 30 - Math.min(24, Math.max(2, scoreFromTest(test) / 4));
    return `${x},${y}`;
  }).join(' ');
};

export default function CPTracker() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [skillGapData, setSkillGapData] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, skillGapRes] = await Promise.all([
        api.get('/profile/me'),
        api.get('/profile/skill-gap')
      ]);
      setProfileData(profileRes.data || null);
      setSkillGapData(skillGapRes.data || null);
      setError('');
    } catch (err) {
      console.error('Failed to load CP tracker data:', err);
      setError(err.response?.data?.msg || 'Failed to load CP tracker data.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const codingProfile = profileData?.cdcProfile?.codingProfile || {};
  const tests = Array.isArray(profileData?.cdcProfile?.mockTestScores) ? profileData.cdcProfile.mockTestScores : [];
  const latestTests = [...tests].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)).slice(0, 5);
  const primaryRole = skillGapData?.roles?.[0] || null;
  const gapSkills = (primaryRole?.requiredSkills || []).filter((skill) => skill.currentLevel < skill.reqLevel).slice(0, 3);
  const averageTestScore = useMemo(() => {
    if (tests.length === 0) return 0;
    const total = tests.reduce((sum, test) => sum + scoreFromTest(test), 0);
    return Math.round(total / tests.length);
  }, [tests]);

  const mainPlatform = codingProfile.platform || 'Competitive Platform';
  const mainHandle = codingProfile.handle ? `@${codingProfile.handle}` : 'Not linked yet';
  const mainRating = Number(codingProfile.rating || 0);
  const solvedCount = Number(codingProfile.problemsSolved || 0);
  const rankBand = getPlatformRank(mainRating);
  const streakDays = tests.length > 0 ? Math.max(3, Math.round(solvedCount / 30)) : Math.max(3, Math.round(solvedCount / 50));
  const lastChange = tests.length > 0 ? `${tests[0].category} ${scoreFromTest(tests[0])}%` : `+${Math.max(5, Math.round(mainRating / 50) || 5)}`;

  return (
    <div className="cp-container animate-fade-in stagger-1">
      <div className="cp-header">
        <div>
          <h1 className="cp-heading">Competitive Programming <span className="gradient-text">Tracker</span></h1>
          <p className="cp-subheading">Track your progress using your saved profile, assessments, and skill-gap data</p>
        </div>
        <button
          className={`btn btn-primary refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={16} /> {isRefreshing ? 'Syncing...' : 'Sync Profiles'}
        </button>
      </div>

      {loading && (
        <div className="panel glass-panel mb-6">
          Loading your latest coding profile and assessments...
        </div>
      )}

      {error && (
        <div className="panel glass-panel mb-6" style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '1px dashed rgba(239, 68, 68, 0.3)' }}>
          {error.includes("There is no profile") ? (
            <>
              <AlertCircle size={40} style={{ margin: '0 auto 1rem', color: 'var(--error)', opacity: 0.8 }} />
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>Profile Required</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', maxWidth: '400px', margin: '0 auto 1.5rem auto' }}>
                You need to set up your profile and link your competitive programming accounts to unlock the CP Tracker.
              </p>
              <Link to="/profile" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                Go to Profile
              </Link>
            </>
          ) : (
            <div style={{ color: 'var(--error)' }}>{error}</div>
          )}
        </div>
      )}

      <div className="cp-platforms-grid mb-6">
        <div className="panel glass-panel cp-platform-card leetcode animate-fade-in stagger-2">
          <div className="cpp-header">
            <div className="cpp-brand">
              <div className="cpp-icon lc"><Code2 size={24} color="#ffa116" /></div>
              <div>
                <h3>{mainPlatform}</h3>
                <span className="cpp-username">{mainHandle}</span>
              </div>
            </div>
            <div className="cpp-badge lc-badge">{rankBand}</div>
          </div>

          <div className="cpp-stats">
            <div className="cpp-stat-item">
              <span className="cpp-label">Rating</span>
              <span className="cpp-value gradient-text-lc">{mainRating}</span>
            </div>
            <div className="cpp-stat-item">
              <span className="cpp-label">Solved</span>
              <span className="cpp-value">{solvedCount}</span>
            </div>
            <div className="cpp-stat-item">
              <span className="cpp-label">Readiness</span>
              <span className="cpp-value">{profileData?.cdcProfile?.readinessScore ?? 0}%</span>
            </div>
          </div>

          <div className="cpp-progress-section">
            <div className="cpp-progress-labels">
              <span className="easy">Tests: {latestTests.length}</span>
              <span className="medium">Avg: {averageTestScore}%</span>
              <span className="hard">Focus gaps: {gapSkills.length}</span>
            </div>
            <div className="cpp-progress-bar">
              <div className="cpp-bar-fill easy-fill" style={{ width: `${Math.min(100, Math.max(15, averageTestScore || 20))}%` }}></div>
            </div>
          </div>

          <div className="cpp-footer mt-4">
            <span className="cpp-streak"><Zap size={14} color="#ffa116" /> {streakDays} Day Streak</span>
            <span className="cpp-contest"><TrendingUp size={14} /> Last: {lastChange}</span>
          </div>
        </div>

        <div className="panel glass-panel cp-platform-card codeforces animate-fade-in stagger-3">
          <div className="cpp-header">
            <div className="cpp-brand">
              <div className="cpp-icon cf"><BarChart2 size={24} color="#318ce7" /></div>
              <div>
                <h3>Target Role Match</h3>
                <span className="cpp-username">{primaryRole?.title || 'No role selected'}</span>
              </div>
            </div>
            <div className="cpp-badge cf-badge specialist">{primaryRole ? `${primaryRole.match}%` : '0%'}</div>
          </div>

          <div className="cpp-stats">
            <div className="cpp-stat-item">
              <span className="cpp-label">Match</span>
              <span className="cpp-value specialist-text">{primaryRole?.match || 0}%</span>
            </div>
            <div className="cpp-stat-item">
              <span className="cpp-label">Covered</span>
              <span className="cpp-value">{primaryRole ? primaryRole.requiredSkills.filter((skill) => skill.currentLevel >= skill.reqLevel).length : 0}</span>
            </div>
            <div className="cpp-stat-item">
              <span className="cpp-label">Gaps</span>
              <span className="cpp-value">{gapSkills.length}</span>
            </div>
          </div>

          <div className="cpp-chart-placeholder mt-4">
            <svg viewBox="0 0 100 30" className="rating-chart">
              <polyline
                fill="none"
                stroke="#318ce7"
                strokeWidth="2"
                points={buildTrendPoints(latestTests)}
              />
              <circle cx="100" cy="12" r="3" fill="#318ce7" />
            </svg>
            <div className="chart-label">Recent Assessment Trend</div>
          </div>

          <div className="cpp-footer mt-4">
            <span className="cpp-contest">Top Role: {primaryRole?.title || 'Unassigned'}</span>
          </div>
        </div>
      </div>

      <div className="cp-grid">
        <div className="panel glass-panel animate-fade-in stagger-4">
          <div className="panel-header mb-4">
            <h3 className="panel-title"><BookOpen size={18} /> Recent Assessments</h3>
          </div>
          <div className="submissions-list">
            <div className="sub-header-row">
              <span className="sub-col prob">Category</span>
              <span className="sub-col diff">Score</span>
              <span className="sub-col stat">Status</span>
              <span className="sub-col time">Time</span>
            </div>
            {latestTests.length > 0 ? latestTests.map((test, idx) => {
              const pct = scoreFromTest(test);
              return (
                <div key={`${test.category}-${idx}`} className="submission-row">
                  <div className="sub-col prob">
                    <div className={`plat-dot ${pct >= 75 ? 'leetcode' : 'codeforces'}`}></div>
                    <span>{test.category}</span>
                    <span className="sub-lang">Assessment</span>
                  </div>
                  <div className="sub-col diff">
                    <span className={`diff-badge ${pct >= 75 ? 'easy' : pct >= 50 ? 'medium' : 'hard'}`}>{pct}%</span>
                  </div>
                  <div className="sub-col stat">
                    <span className={`status-text ${pct >= 75 ? 'accepted' : 'rejected'}`}>
                      {pct >= 75 ? 'Strong' : 'Needs Work'}
                    </span>
                  </div>
                  <div className="sub-col time">{new Date(test.date).toLocaleDateString()}</div>
                </div>
              );
            }) : (
              <div className="submission-row">
                <div className="sub-col prob">No assessments found</div>
              </div>
            )}
          </div>
        </div>

        <div className="panel glass-panel gradient-border-panel animate-fade-in stagger-4">
          <div className="panel-header mb-4">
            <h3 className="panel-title"><Trophy size={18} color="var(--accent)" /> Insights & Goals</h3>
          </div>
          <div className="cp-insights">
            <div className="cp-insight-item">
              <div className="cpi-icon"><TrendingUp size={16} /></div>
              <div>
                <h4>{mainRating >= 1600 ? 'Strong platform momentum' : 'Build platform momentum'}</h4>
                <p>
                  {mainRating >= 1600
                    ? `Your ${mainPlatform} rating is solid at ${mainRating}. Keep competing to push past the next band.`
                    : `Your linked platform is ready, but the current rating is ${mainRating}. Solve and contest consistently to grow faster.`}
                </p>
              </div>
            </div>
            <div className="cp-insight-item">
              <div className="cpi-icon warning"><AlertCircle size={16} /></div>
              <div>
                <h4>{primaryRole?.title || 'Target role not selected'}</h4>
                <p>{primaryRole?.insight || 'Complete your profile skills to generate a role-based gap analysis.'}</p>
              </div>
            </div>
            <div className="cp-insight-item">
              <div className="cpi-icon"><CheckCircle2 size={16} /></div>
              <div>
                <h4>Assessment average</h4>
                <p>
                  {averageTestScore > 0
                    ? `Your latest assessments average ${averageTestScore}%. Review the weakest categories and retry the mock tests.`
                    : 'No assessments available yet. Start with the mock tests to build a live progress trail.'}
                </p>
              </div>
            </div>
          </div>

          <h3 className="panel-title mb-4 mt-6"><Target size={18} /> Next Focus Areas</h3>
          <div className="upcoming-contests">
            {gapSkills.length > 0 ? gapSkills.map((skill, idx) => (
              <div className="contest-row" key={`${skill.name}-${idx}`}>
                <span className="c-name lc-color">{skill.name}</span>
                <span className="c-time">{skill.currentLevel}/{skill.reqLevel}</span>
              </div>
            )) : (
              <div className="contest-row">
                <span className="c-name lc-color">All key gaps are covered</span>
                <span className="c-time">Keep practicing and revising</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
