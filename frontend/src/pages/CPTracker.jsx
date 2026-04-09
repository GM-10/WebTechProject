import React, { useState } from 'react';
import { Code2, Trophy, BarChart2, Calendar, TrendingUp, AlertCircle, RefreshCw, Layers, Zap } from 'lucide-react';
import './CPTracker.css';

const mockProfiles = {
  leetcode: {
    username: 'alexjd_codes',
    rating: 1845,
    rank: 'Knight',
    globalRank: '14,230',
    solved: { easy: 145, medium: 230, hard: 45, total: 420 },
    streak: 14,
    recentContest: { name: 'Weekly Contest 389', change: '+35' }
  },
  codeforces: {
    username: 'alexjd',
    rating: 1540,
    maxRating: 1610,
    rank: 'Specialist',
    contests: 24,
    recentContest: { name: 'Codeforces Round 920 (Div 2)', change: '-15' }
  }
};

const recentSubmissions = [
  { id: 1, problem: 'Two Sum', platform: 'leetcode', difficulty: 'Easy', status: 'Accepted', date: '2 hours ago', language: 'Java' },
  { id: 2, problem: 'LRU Cache', platform: 'leetcode', difficulty: 'Medium', status: 'Accepted', date: '5 hours ago', language: 'JavaScript' },
  { id: 3, problem: '1920A - Distinct Buttons', platform: 'codeforces', difficulty: '800', status: 'Accepted', date: '1 day ago', language: 'C++' },
  { id: 4, problem: 'Trapping Rain Water', platform: 'leetcode', difficulty: 'Hard', status: 'Time Limit Exceeded', date: '1 day ago', language: 'Java' },
  { id: 5, problem: '1918B - Minimize Inversions', platform: 'codeforces', difficulty: '1200', status: 'Accepted', date: '2 days ago', language: 'C++' },
];

export default function CPTracker() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="cp-container animate-fade-in stagger-1">
      <div className="cp-header">
        <div>
          <h1 className="cp-heading">Competitive Programming <span className="gradient-text">Tracker</span></h1>
          <p className="cp-subheading">Track your progress across coding platforms automatically</p>
        </div>
        <button 
          className={`btn btn-primary refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw size={16} /> {isRefreshing ? 'Syncing...' : 'Sync Profiles'}
        </button>
      </div>

      <div className="cp-platforms-grid mb-6">
        {/* LeetCode Card */}
        <div className="panel glass-panel cp-platform-card leetcode animate-fade-in stagger-2">
          <div className="cpp-header">
            <div className="cpp-brand">
              <div className="cpp-icon lc"><Code2 size={24} color="#ffa116" /></div>
              <div>
                <h3>LeetCode</h3>
                <span className="cpp-username">@{mockProfiles.leetcode.username}</span>
              </div>
            </div>
            <div className="cpp-badge lc-badge">{mockProfiles.leetcode.rank}</div>
          </div>
          
          <div className="cpp-stats">
            <div className="cpp-stat-item">
              <span className="cpp-label">Rating</span>
              <span className="cpp-value gradient-text-lc">{mockProfiles.leetcode.rating}</span>
            </div>
            <div className="cpp-stat-item">
              <span className="cpp-label">Global Rank</span>
              <span className="cpp-value">{mockProfiles.leetcode.globalRank}</span>
            </div>
            <div className="cpp-stat-item">
              <span className="cpp-label">Total Solved</span>
              <span className="cpp-value">{mockProfiles.leetcode.solved.total}</span>
            </div>
          </div>

          <div className="cpp-progress-section">
            <div className="cpp-progress-labels">
              <span className="easy">Easy: {mockProfiles.leetcode.solved.easy}</span>
              <span className="medium">Med: {mockProfiles.leetcode.solved.medium}</span>
              <span className="hard">Hard: {mockProfiles.leetcode.solved.hard}</span>
            </div>
            <div className="cpp-progress-bar">
              <div className="cpp-bar-fill easy-fill" style={{ width: '35%' }}></div>
              <div className="cpp-bar-fill medium-fill" style={{ width: '55%' }}></div>
              <div className="cpp-bar-fill hard-fill" style={{ width: '10%' }}></div>
            </div>
          </div>
          
          <div className="cpp-footer mt-4">
            <span className="cpp-streak"><Zap size={14} color="#ffa116" /> {mockProfiles.leetcode.streak} Day Streak</span>
            <span className="cpp-contest"><TrendingUp size={14} /> Last: {mockProfiles.leetcode.recentContest.change}</span>
          </div>
        </div>

        {/* Codeforces Card */}
        <div className="panel glass-panel cp-platform-card codeforces animate-fade-in stagger-3">
          <div className="cpp-header">
            <div className="cpp-brand">
              <div className="cpp-icon cf"><BarChart2 size={24} color="#318ce7" /></div>
              <div>
                <h3>Codeforces</h3>
                <span className="cpp-username">@{mockProfiles.codeforces.username}</span>
              </div>
            </div>
            <div className="cpp-badge cf-badge specialist">{mockProfiles.codeforces.rank}</div>
          </div>
          
          <div className="cpp-stats">
            <div className="cpp-stat-item">
              <span className="cpp-label">Rating</span>
              <span className="cpp-value specialist-text">{mockProfiles.codeforces.rating}</span>
            </div>
            <div className="cpp-stat-item">
              <span className="cpp-label">Max Rating</span>
              <span className="cpp-value">{mockProfiles.codeforces.maxRating}</span>
            </div>
            <div className="cpp-stat-item">
              <span className="cpp-label">Contests</span>
              <span className="cpp-value">{mockProfiles.codeforces.contests}</span>
            </div>
          </div>

          <div className="cpp-chart-placeholder mt-4">
            <svg viewBox="0 0 100 30" className="rating-chart">
              <polyline 
                fill="none" 
                stroke="#318ce7" 
                strokeWidth="2"
                points="0,25 20,20 40,28 60,15 80,10 100,12" 
              />
              <circle cx="100" cy="12" r="3" fill="#318ce7" />
            </svg>
            <div className="chart-label">Rating History</div>
          </div>

          <div className="cpp-footer mt-4">
            <span className="cpp-contest">Last Contest: {mockProfiles.codeforces.recentContest.change}</span>
          </div>
        </div>
      </div>

      <div className="cp-grid">
        <div className="panel glass-panel animate-fade-in stagger-4">
          <div className="panel-header mb-4">
            <h3 className="panel-title"><Layers size={18} /> Recent Submissions</h3>
          </div>
          <div className="submissions-list">
            <div className="sub-header-row">
              <span className="sub-col prob">Problem</span>
              <span className="sub-col diff">Difficulty</span>
              <span className="sub-col stat">Status</span>
              <span className="sub-col time">Time</span>
            </div>
            {recentSubmissions.map(sub => (
              <div key={sub.id} className="submission-row">
                <div className="sub-col prob">
                  <div className={`plat-dot ${sub.platform}`}></div>
                  <span>{sub.problem}</span>
                  <span className="sub-lang">{sub.language}</span>
                </div>
                <div className="sub-col diff">
                  <span className={`diff-badge ${sub.difficulty.toLowerCase()}`}>{sub.difficulty}</span>
                </div>
                <div className="sub-col stat">
                  <span className={`status-text ${sub.status === 'Accepted' ? 'accepted' : 'rejected'}`}>
                    {sub.status}
                  </span>
                </div>
                <div className="sub-col time">{sub.date}</div>
              </div>
            ))}
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
                <h4>Consistency is building</h4>
                <p>You've solved problems for 14 consecutive days. Maintain this streak to build pattern recognition!</p>
              </div>
            </div>
            <div className="cp-insight-item">
              <div className="cpi-icon warning"><AlertCircle size={16} /></div>
              <div>
                <h4>Graph Algorithms Gap</h4>
                <p>Based on recent contests, Graph traversal (BFS/DFS) problems take you 3x longer than average.</p>
              </div>
            </div>
          </div>
          
          <h3 className="panel-title mb-4 mt-6"><Calendar size={18} /> Upcoming Contests</h3>
          <div className="upcoming-contests">
            <div className="contest-row">
              <span className="c-name lc-color">LeetCode BiWeekly 125</span>
              <span className="c-time">Today, 8:00 PM</span>
            </div>
            <div className="contest-row">
              <span className="c-name cf-color">Codeforces Round 925 (Div. 2)</span>
              <span className="c-time">Tomorrow, 8:05 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
