import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Briefcase, 
  GraduationCap, 
  TrendingUp, 
  Award,
  ChevronRight,
  Send,
  Calendar,
  Code2
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}') || {};
  const isCDC = user.role === 'cdc' || user.role === 'admin';

  const [stats, setStats] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes, jobsRes, profileRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/applications'), // Still need this for interview list
          api.get('/jobs'),
          api.get('/profile/me').catch(() => ({ data: null }))
        ]);
        
        // Backend now returns pre-formatted stats
        const backendStats = statsRes.data.stats || [];
        const activity = statsRes.data.recentActivity || [];
        const apps = Array.isArray(appsRes.data) ? appsRes.data : [];
        const jobs = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const cdcProfile = profileRes?.data?.cdcProfile || null;
        
        setStudentProfile(cdcProfile);
        setRecentActivity(activity);

        const iconLookup = isCDC
          ? {
              'Total Students': GraduationCap,
              'Placed Students': Briefcase,
              'Total Offers': Award,
              'Active Companies': TrendingUp
            }
          : {
              'Applications': Briefcase,
              'Offers': Award,
              'Interviews': Calendar,
              'Readiness': TrendingUp
            };
        
        const colorMap = ['var(--primary)', 'var(--success)', 'var(--accent)', 'var(--secondary)'];

        setStats(backendStats.map((s, idx) => ({
          ...s,
          icon: iconLookup[s.label] || Briefcase,
          color: colorMap[idx] || 'var(--primary)'
        })));

        // Filter interviews
        const interviews = [];
        apps.forEach(app => {
          if (app && app.rounds && app.job) {
            app.rounds.forEach(round => {
              if (round.status === 'upcoming') {
                interviews.push({
                  company: app.job.company || 'Unknown',
                  role: app.job.role || 'Unknown Role',
                  name: round.name,
                  date: new Date(round.date),
                  time: round.time || 'TBD',
                  studentName: app.student?.name
                });
              }
            });
          }
        });
        interviews.sort((a, b) => a.date - b.date);
        setUpcomingInterviews(interviews.slice(0, 4));

        setRecommendedJobs(jobs.slice(0, 3));
        setLoading(false);
      } catch (err) {
        console.error('Dashboard error:', err);
        setLoading(false);
      }
    };
    fetchData();
  }, [isCDC]);

  const getStatValue = (label) => Number(stats.find((item) => item.label === label)?.value || 0);
  const totalStudents = getStatValue('Total Students');
  const placedStudents = getStatValue('Placed Students');
  const activeCompanies = getStatValue('Active Companies');
  const readinessScore = Number(studentProfile?.readinessScore || studentProfile?.atsScore || 85);
  const placementPercent = totalStudents > 0 ? Math.round((placedStudents / totalStudents) * 100) : 0;

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh' }}>
        <p>Analyzing recruitment journeys...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container animate-fade-in stagger-1">
      {/* Role-Based Banner */}
      <div className="welcome-banner glass-panel">
        <div className="banner-content">
          <h1 className="banner-title">
            {isCDC ? 'CDC Command ' : 'Student '} <span className="gradient-text">Center</span>
          </h1>
          <p className="banner-subtitle">
            {isCDC 
              ? `Monitoring ${totalStudents || '...'} students across ${activeCompanies || '...'} active drives.`
              : `Your placement journey is on track. You have ${upcomingInterviews.length} upcoming interviews this week.`
            }
          </p>
          <div className="banner-actions">
            <button className="btn btn-primary mt-4" onClick={() => navigate(isCDC ? '/app/analytics' : '/app/applications')}>
              <Send size={18} /> {isCDC ? 'View Placement Analytics' : 'Track Applications'}
            </button>
            {isCDC && (
               <button className="btn btn-ghost border-btn mt-4 ml-4" onClick={() => navigate('/app/jobs')}>
               <Briefcase size={18} /> Manage Job Drives
             </button>
            )}
          </div>
        </div>
        <div className="banner-visual">
          <div className="skill-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" strokeDasharray={`${isCDC ? placementPercent : readinessScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <text x="18" y="20.35" className="percentage">{isCDC ? placementPercent : readinessScore}%</text>
            </svg>
            <span className="skill-label">{isCDC ? 'Placement %' : 'Readiness'}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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
                <p className="stat-title">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid mt-6">
        {/* Left Column: List Section */}
        <div className="grid-col main-col">
          <div className="panel glass-panel">
            <div className="panel-header">
              <h3 className="panel-title">{isCDC ? 'Hiring Pipeline (Active Drives)' : 'Recommended Jobs'}</h3>
              <button className="btn-ghost panel-action" onClick={() => navigate('/app/jobs')}>View All <ChevronRight size={16} /></button>
            </div>
            <div className="job-list">
              {recommendedJobs.slice(0, 4).map((job, idx) => (
                <div key={idx} className="job-card transition-all">
                  <div className="job-info">
                    <h4>{job.role}</h4>
                    <span className="company">{job.company} &middot; {job.type}</span>
                    <div className="tags mt-2">
                       {job.tags && job.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="job-action">
                    <div className="match-score">
                      <span className="score" style={{color: 'var(--success)'}}>
                        {isCDC ? `${job.applicantsCount || 0} Students Applied` : '92% Match'}
                      </span>
                    </div>
                    <button className="btn btn-ghost border-btn" onClick={() => navigate(isCDC ? `/app/applications` : `/app/jobs`)}>
                       {isCDC ? 'Review Applications' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isCDC && (
            <div className="panel glass-panel mt-6">
              <div className="panel-header">
                <h3 className="panel-title">Live Activity Feed</h3>
              </div>
              <div className="activity-list mt-4">
                {recentActivity.length > 0 ? recentActivity.map((act, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-icon-container" style={{backgroundColor: 'rgba(56, 189, 248, 0.1)'}}>
                      <TrendingUp size={16} color="var(--primary)" />
                    </div>
                    <div className="activity-content">
                      <p><strong>{act.studentName}</strong> updated application for <strong>{act.role}</strong> at <strong>{act.company}</strong></p>
                      <span className="activity-time">{new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &middot; status: {act.status}</span>
                    </div>
                  </div>
                )) : (
                  <p className="no-data-msg">No recent activity detected.</p>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Right Column: Schedule / Admin Section */}
        <div className="grid-col side-col">
          <div className="panel glass-panel mb-6">
            <div className="panel-header">
              <h3 className="panel-title">{isCDC ? 'Interviews Today' : 'Upcoming Sessions'}</h3>
            </div>
            <div className="schedule-list">
              {upcomingInterviews.length > 0 ? upcomingInterviews.map((interview, idx) => (
                <div key={idx} className="schedule-item">
                  <div className="date-box" style={{ background: isCDC ? 'rgba(56, 189, 248, 0.1)' : '' }}>
                    <span className="day">{interview.date.getDate()}</span>
                    <span className="month">{interview.date.toLocaleString('default', { month: 'short' })}</span>
                  </div>
                  <div className="schedule-info">
                    <h4>{interview.company} {isCDC && `(${interview.studentName})`}</h4>
                    <span><Calendar size={14} /> {interview.time} | {interview.role}</span>
                  </div>
                </div>
              )) : (
                <p className="no-data-msg">Quiet day! No sessions found.</p>
              )}
            </div>
          </div>

          <div className="panel glass-panel gradient-border-panel">
            <div className="skill-promo">
              <div className="icon-circle mb-4">
                <TrendingUp size={24} color="var(--secondary)" />
              </div>
              <h4>{isCDC ? 'Generate Report' : 'Career Blueprint'}</h4>
              <p>
                {isCDC 
                  ? 'Download the weekly placement summary for departmental review.' 
                  : 'Your DS score is slightly below average. Take a quick mock test to improve.'
                }
              </p>
              <button className="btn w-full mt-4" style={{background: 'var(--glass-bg)', border: '1px solid var(--glass-border)'}} onClick={() => navigate(isCDC ? '/app/analytics' : '/app/tests')}>
                {isCDC ? 'Download PDF' : 'Start Assessment'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

