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

