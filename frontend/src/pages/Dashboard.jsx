import React from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  Award,
  ChevronRight,
  Send,
  Calendar,
  Code
} from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const stats = [
    { title: 'Applied Roles', value: '12', icon: Briefcase, color: 'var(--primary)' },
    { title: 'Offers Received', value: '2', icon: Award, color: 'var(--success)' },
    { title: 'Skill Score', value: '85%', icon: TrendingUp, color: 'var(--secondary)' },
    { title: 'Tests Taken', value: '24', icon: GraduationCap, color: 'var(--accent)' },
  ];

  return (
    <div className="dashboard-container animate-fade-in stagger-1">
      <div className="welcome-banner glass-panel">
        <div className="banner-content">
          <h1 className="banner-title">
            Welcome back, <span className="gradient-text">Alex!</span>
          </h1>
          <p className="banner-subtitle">
            Your placement journey is on track. You have 2 upcoming interviews this week.
          </p>
          <button className="btn btn-primary mt-4">
            <Send size={18} /> View Applications
          </button>
        </div>
        <div className="banner-visual">
          <div className="skill-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path className="circle"
                strokeDasharray="85, 100"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="20.35" className="percentage">85%</text>
            </svg>
            <span className="skill-label">Placement Readiness</span>
          </div>
        </div>
      </div>

      <div className="stats-grid mt-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`stat-card glass-panel animate-fade-in stagger-${idx+2}`}>
              <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-info">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid mt-6">
        <div className="grid-col main-col">
          <div className="panel glass-panel">
            <div className="panel-header">
              <h3 className="panel-title">Recommended Jobs</h3>
              <button className="btn-ghost panel-action">View All <ChevronRight size={16} /></button>
            </div>
            <div className="job-list">
              {[
                { r: 'Software Engineer', c: 'Google', t: 'Full Time', tags: ['Java', 'React'], match: 92 },
                { r: 'SDE-1', c: 'Amazon', t: 'Full Time', tags: ['AWS', 'Node.js'], match: 88 },
                { r: 'Frontend Developer', c: 'Microsoft', t: 'Internship', tags: ['React', 'CSS'], match: 95 }
              ].map((job, idx) => (
                <div key={idx} className="job-card transition-all">
                  <div className="job-info">
                    <h4>{job.r}</h4>
                    <span className="company">{job.c} &middot; {job.t}</span>
                    <div className="tags mt-2">
                      {job.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="job-action">
                    <div className="match-score">
                      <span className="score" style={{color: job.match > 90 ? 'var(--success)' : 'var(--warning)'}}>{job.match}% Match</span>
                    </div>
                    <button className="btn btn-ghost border-btn">Apply Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid-col side-col">
          <div className="panel glass-panel mb-6">
            <div className="panel-header">
              <h3 className="panel-title">Upcoming Schedule</h3>
            </div>
            <div className="schedule-list">
              <div className="schedule-item">
                <div className="date-box">
                  <span className="day">12</span>
                  <span className="month">Oct</span>
                </div>
                <div className="schedule-info">
                  <h4>Google Online Assessment</h4>
                  <span><Calendar size={14} /> 10:00 AM - 11:30 AM</span>
                </div>
              </div>
              <div className="schedule-item">
                <div className="date-box">
                  <span className="day">15</span>
                  <span className="month">Oct</span>
                </div>
                <div className="schedule-info">
                  <h4>Amazon Technical Interview</h4>
                  <span><Calendar size={14} /> 02:00 PM - 03:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="panel glass-panel gradient-border-panel">
            <div className="skill-promo">
              <div className="icon-circle mb-4">
                <Code size={24} color="var(--secondary)" />
              </div>
              <h4>Up your game</h4>
              <p>Your Data Structures score is slightly below average for top tier companies. Take a quick mock test to improve.</p>
              <button className="btn w-full mt-4" style={{background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'}}>Start Mock Test</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
