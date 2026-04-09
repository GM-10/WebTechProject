import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
  Calendar,
  Building2,
  Filter,
  Search,
  Trophy,
  ArrowRight,
  Eye,
  MessageSquare,
  MapPin,
  TrendingUp,
  BarChart3,
  Target
} from 'lucide-react';
import './Applications.css';

const applications = [
  {
    id: 1,
    role: 'Software Engineer',
    company: 'Google',
    logo: 'G',
    logoColor: '#4285f4',
    location: 'Bangalore',
    ctc: '₹25-35 LPA',
    appliedDate: 'Mar 25, 2026',
    status: 'in-progress',
    currentRound: 2,
    totalRounds: 4,
    rounds: [
      { name: 'Online Assessment', status: 'passed', date: 'Mar 26', score: '87/100' },
      { name: 'Technical Interview 1', status: 'passed', date: 'Mar 28', feedback: 'Strong DS skills' },
      { name: 'Technical Interview 2', status: 'upcoming', date: 'Apr 02', time: '2:00 PM' },
      { name: 'HR Interview', status: 'pending', date: 'TBD' },
    ],
  },
  {
    id: 2,
    role: 'SDE-1',
    company: 'Amazon',
    logo: 'A',
    logoColor: '#ff9900',
    location: 'Hyderabad',
    ctc: '₹20-30 LPA',
    appliedDate: 'Mar 20, 2026',
    status: 'in-progress',
    currentRound: 1,
    totalRounds: 4,
    rounds: [
      { name: 'Online Assessment', status: 'passed', date: 'Mar 22', score: '92/100' },
      { name: 'Technical Interview 1', status: 'upcoming', date: 'Mar 31', time: '10:00 AM' },
      { name: 'Technical Interview 2', status: 'pending', date: 'TBD' },
      { name: 'Bar Raiser', status: 'pending', date: 'TBD' },
    ],
  },
  {
    id: 3,
    role: 'Frontend Developer Intern',
    company: 'Microsoft',
    logo: 'M',
    logoColor: '#00a4ef',
    location: 'Noida',
    ctc: '₹80K/month',
    appliedDate: 'Mar 18, 2026',
    status: 'offered',
    currentRound: 3,
    totalRounds: 3,
    rounds: [
      { name: 'Online Assessment', status: 'passed', date: 'Mar 19', score: '95/100' },
      { name: 'Technical Interview', status: 'passed', date: 'Mar 23', feedback: 'Excellent React knowledge' },
      { name: 'HR Interview', status: 'passed', date: 'Mar 26', feedback: 'Great cultural fit' },
    ],
    offerDetails: {
      deadline: 'Apr 10, 2026',
      stipend: '₹80,000/month',
      duration: '6 months',
    }
  },
  {
    id: 4,
    role: 'Data Engineer',
    company: 'Flipkart',
    logo: 'F',
    logoColor: '#2874f0',
    location: 'Bangalore',
    ctc: '₹18-25 LPA',
    appliedDate: 'Mar 15, 2026',
    status: 'rejected',
    currentRound: 1,
    totalRounds: 3,
    rounds: [
      { name: 'Online Assessment', status: 'passed', date: 'Mar 16', score: '68/100' },
      { name: 'Technical Interview', status: 'failed', date: 'Mar 20', feedback: 'Needs stronger SQL skills' },
      { name: 'Hiring Manager', status: 'cancelled', date: '-' },
    ],
  },
  {
    id: 5,
    role: 'Product Engineer',
    company: 'Razorpay',
    logo: 'R',
    logoColor: '#3395ff',
    location: 'Bangalore',
    ctc: '₹22-28 LPA',
    appliedDate: 'Mar 28, 2026',
    status: 'applied',
    currentRound: 0,
    totalRounds: 3,
    rounds: [
      { name: 'Coding Round', status: 'pending', date: 'Apr 05' },
      { name: 'System Design', status: 'pending', date: 'TBD' },
      { name: 'Cultural Fit', status: 'pending', date: 'TBD' },
    ],
  },
];

const statusConfig = {
  'applied': { label: 'Applied', color: 'var(--accent)', icon: ClipboardList, bg: 'rgba(56, 189, 248, 0.1)' },
  'in-progress': { label: 'In Progress', color: 'var(--primary)', icon: Clock, bg: 'rgba(129, 140, 248, 0.1)' },
  'offered': { label: 'Offer Received', color: 'var(--success)', icon: Trophy, bg: 'rgba(16, 185, 129, 0.1)' },
  'rejected': { label: 'Not Selected', color: 'var(--error)', icon: XCircle, bg: 'rgba(239, 68, 68, 0.1)' },
};

const roundStatusConfig = {
  'passed': { color: 'var(--success)', icon: CheckCircle2 },
  'failed': { color: 'var(--error)', icon: XCircle },
  'upcoming': { color: 'var(--warning)', icon: AlertCircle },
  'pending': { color: 'var(--text-muted)', icon: Clock },
  'cancelled': { color: 'var(--text-muted)', icon: XCircle },
};

export default function Applications() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedApp, setExpandedApp] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedulingData, setSchedulingData] = useState({ appId: '', roundIdx: '', date: '', time: '' });
  const user = JSON.parse(sessionStorage.getItem('user') || '{}') || {};


  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get('/applications');
        const transformedData = res.data.map(app => ({
          ...app,
          studentName: app.student?.name || 'N/A',
          role: app.job?.role || 'Deleted Job',
          company: app.job?.company || 'N/A',
          logo: app.job?.logo || 'C',
          logoColor: app.job?.logoColor || '#3b82f6',
          location: app.job?.location || 'Remote',
          ctc: app.job?.ctc || 'N/A',
          appliedDate: new Date(app.appliedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        }));
        setApps(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/applications/schedule/${schedulingData.appId}/${schedulingData.roundIdx}`, {
        date: schedulingData.date,
        time: schedulingData.time
      });
      alert('Interview Scheduled Successfully');
      setShowScheduleModal(false);
      window.location.reload();
    } catch (err) {
      console.error('Scheduling error:', err);
      alert('Failed to schedule interview');
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh' }}>
        <p>Analyzing recruitment journeys...</p>
      </div>
    );
  }

  return (
    <div className="apps-container animate-fade-in stagger-1">
      {/* Header */}
      <div className="apps-header">
        <div>
          <h1 className="apps-heading">Application <span className="gradient-text">Tracker</span></h1>
          <p className="apps-subheading">
            {user.role === 'cdc' ? 'Centralized student application management' : 'Track your placement journey through every step'}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="apps-toolbar glass-panel">
        <div className="apps-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={user.role === 'cdc' ? "Search students or companies..." : "Search companies..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="apps-filter-tabs">
          {['all', 'applied', 'in-progress', 'offered', 'rejected'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filterStatus === f ? 'active' : ''}`}
              onClick={() => setFilterStatus(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Application Cards */}
      <div className="apps-list">
        {filteredApps.map((app, idx) => {
          const statusInfo = statusConfig[app.status] || statusConfig['applied'];
          const StatusIcon = statusInfo.icon;
          const isExpanded = expandedApp === app._id;
          const progress = app.totalRounds > 0 ? Math.round((app.currentRound / app.totalRounds) * 100) : 0;

          return (
            <div
              key={app._id}
              className={`app-card glass-panel animate-fade-in stagger-${Math.min(idx + 2, 4)} ${isExpanded ? 'expanded' : ''}`}
            >
              <div className="app-card-main" onClick={() => setExpandedApp(isExpanded ? null : app._id)}>
                <div className="app-card-left">
                  <div className="company-logo" style={{ backgroundColor: `${app.logoColor}20`, color: app.logoColor }}>
                    {app.logo}
                  </div>
                  <div className="app-card-info">
                    <h3 className="app-card-title">{app.role} {user.role === 'cdc' && <span className="student-badge">&middot; {app.studentName}</span>}</h3>
                    <div className="app-card-meta">
                      <span><Building2 size={14} /> {app.company}</span>
                      <span><Calendar size={14} /> Applied {app.appliedDate}</span>
                    </div>
                  </div>
                </div>

                <div className="app-card-right">
                  <div className="app-progress-section">
                    <div className="app-progress-bar-track">
                      <div className="app-progress-bar-fill" style={{ width: `${progress}%`, background: statusInfo.color }}></div>
                    </div>
                    <span className="app-progress-text" style={{ color: statusInfo.color }}>{app.currentRound}/{app.totalRounds} rounds</span>
                  </div>
                  <div className="app-status-badge" style={{ backgroundColor: statusInfo.bg, color: statusInfo.color }}>
                    <StatusIcon size={14} /> {statusInfo.label}
                  </div>
                  <ChevronRight size={18} className={`app-chevron ${isExpanded ? 'open' : ''}`} />
                </div>
              </div>

              {isExpanded && (
                <div className="app-expanded animate-fade-in">
                  <div className="app-timeline">
                    {app.rounds.map((round, rIdx) => {
                      const roundInfo = roundStatusConfig[round.status] || roundStatusConfig['pending'];
                      const RoundIcon = roundInfo.icon;
                      return (
                        <div key={rIdx} className={`timeline-step ${round.status}`}>
                          <div className="timeline-connector">
                            <div className="timeline-dot" style={{ borderColor: roundInfo.color, backgroundColor: round.status === 'passed' ? roundInfo.color : 'var(--bg-dark)' }}>
                              <RoundIcon size={14} color={round.status === 'passed' ? '#fff' : roundInfo.color} />
                            </div>
                            {rIdx < app.rounds.length - 1 && <div className="timeline-line"></div>}
                          </div>
                          <div className="timeline-content">
                            <div className="timeline-header">
                              <h4>{round.name}</h4>
                              <span className="timeline-date">{round.date}{round.time ? ` · ${round.time}` : ''}</span>
                            </div>
                            
                            {user.role === 'cdc' && round.status === 'pending' && (
                              <button 
                                className="btn btn-ghost border-btn btn-sm mt-2"
                                onClick={() => {
                                  setSchedulingData({ appId: app._id, roundIdx: rIdx, date: '', time: '' });
                                  setShowScheduleModal(true);
                                }}
                              >
                                <Calendar size={14} /> Schedule Interview
                              </button>
                            )}

                            {round.status === 'upcoming' && (
                              <div className="timeline-upcoming-badge">
                                <AlertCircle size={14} /> Scheduled {round.date} at {round.time}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content glass-panel slide-in">
            <div className="modal-header">
              <h3>Schedule Interview</h3>
              <button className="btn-icon" onClick={() => setShowScheduleModal(false)}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleSchedule} className="modal-body">
              <div className="form-group mb-4">
                <label>Date</label>
                <input 
                  type="date" 
                  required 
                  className="form-input" 
                  value={schedulingData.date}
                  onChange={e => setSchedulingData({...schedulingData, date: e.target.value})}
                />
              </div>
              <div className="form-group mb-6">
                <label>Time</label>
                <input 
                  type="time" 
                  required 
                  className="form-input" 
                  value={schedulingData.time}
                  onChange={e => setSchedulingData({...schedulingData, time: e.target.value})}
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">Confirm Schedule</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

