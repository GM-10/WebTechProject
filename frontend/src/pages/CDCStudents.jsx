import React, { useState, useEffect, useCallback } from 'react';
import {
  Search, Filter, Download, Eye, X, ChevronDown,
  GraduationCap, Users, CheckCircle2, XCircle, Loader2,
  AlertCircle, BookOpen, Code2, Briefcase, StickyNote,
  FileText, Send, TrendingUp, Award, Activity
} from 'lucide-react';
import api from '../utils/api';
import './CDCStudents.css';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const BRANCH_OPTIONS = ['All', 'CSE', 'ICT', 'ECE', 'Mechanical', 'Civil', 'EE', 'Chemical'];
const PLACEMENT_OPTIONS = ['All', 'Placed', 'Unplaced', 'Processing'];
const ELIGIBILITY_OPTIONS = ['All', 'Eligible', 'Ineligible', 'Conditional'];

const badgeClass = (type, value) => {
  if (type === 'placement') {
    if (value === 'Placed') return 'badge-success';
    if (value === 'Processing') return 'badge-warning';
    return 'badge-muted';
  }
  if (type === 'eligibility') {
    if (value === 'Eligible') return 'badge-success';
    if (value === 'Conditional') return 'badge-warning';
    return 'badge-error';
  }
  if (type === 'appStatus') {
    if (['offered', 'accepted'].includes(value)) return 'badge-success';
    if (['shortlisted', 'in-progress'].includes(value)) return 'badge-warning';
    if (value === 'rejected') return 'badge-error';
    if (value === 'No Applications') return 'badge-muted';
    return 'badge-info';
  }
  return 'badge-muted';
};

const cgpaColor = (cgpa) => {
  if (cgpa >= 8) return 'var(--success)';
  if (cgpa >= 7) return 'var(--warning)';
  return 'var(--error)';
};

function ScoreRing({ score, size = 72 }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width={size} height={size} className="score-ring-svg">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--error)'}
        strokeWidth="8"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.8s ease' }}
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" fill="var(--text-main)" fontSize="14" fontWeight="700">{score}</text>
    </svg>
  );
}

function AtsBar({ score }) {
  const color = score >= 75 ? 'var(--success)' : score >= 55 ? 'var(--warning)' : 'var(--error)';
  return (
    <div className="ats-bar-wrap">
      <div className="ats-bar-track">
        <div className="ats-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="ats-bar-label" style={{ color }}>{score}</span>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="cdc-stat-card glass-panel">
      <div className="cdc-stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div>
        <div className="cdc-stat-value">{value}</div>
        <div className="cdc-stat-label">{label}</div>
      </div>
    </div>
  );
}

// ─── MODAL TABS ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'resume', label: 'Resume & ATS', icon: FileText },
  { id: 'applications', label: 'Applications', icon: Briefcase },
  { id: 'tests', label: 'Test Performance', icon: Activity },
  { id: 'notes', label: 'CDC Notes', icon: StickyNote },
];

function ProfileModal({ student, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [detail, setDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoadingDetail(true);
        const res = await api.get(`/cdc/students/${student.userId}`);
        setDetail(res.data);
      } catch (err) {
        console.error('Failed to load student detail:', err);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchDetail();
  }, [student.userId]);

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    try {
      setSavingNote(true);
      const res = await api.post(`/cdc/students/${student.userId}/notes`, { note: noteText });
      setDetail(prev => ({ ...prev, notes: [res.data, ...(prev?.notes || [])] }));
      setNoteText('');
    } catch (err) {
      alert('Failed to save note');
    } finally {
      setSavingNote(false);
    }
  };

  const cdcP = detail?.cdcProfile || {};
  const profile = detail?.profile || {};
  const apps = detail?.applications || [];
  const notes = detail?.notes || [];
  const skills = profile?.skills || [];
  const tests = cdcP?.mockTestScores || [];

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="cdc-modal-backdrop" onClick={onClose}>
      <div className="cdc-modal glass-panel" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="cdc-modal-header">
          <div className="cdc-modal-identity">
            <div className="cdc-modal-avatar">
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="cdc-modal-name">{student.name}</h2>
              <div className="cdc-modal-meta">
                <span>{student.rollNo}</span>
                <span>·</span>
                <span>{student.branch}</span>
                <span>·</span>
                <span style={{ color: cgpaColor(student.cgpa) }}>CGPA {student.cgpa}</span>
                <span>·</span>
                <span className={`cdc-badge ${badgeClass('placement', student.placementStatus)}`}>
                  {student.placementStatus}
                </span>
                <span className={`cdc-badge ${badgeClass('eligibility', student.eligibilityStatus)}`}>
                  {student.eligibilityStatus}
                </span>
              </div>
            </div>
          </div>
          <button className="cdc-modal-close btn-ghost" onClick={onClose}><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="cdc-modal-tabs">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className={`cdc-tab-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="cdc-modal-body">
          {loadingDetail ? (
            <div className="cdc-loading"><Loader2 className="animate-spin" size={32} color="var(--primary)" /></div>
          ) : (
            <>
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="cdc-tab-overview animate-fade-in">
                  <div className="cdc-overview-top">
                    <div className="cdc-readiness-block">
                      <ScoreRing score={cdcP.readinessScore || 0} size={90} />
                      <span className="cdc-readiness-label">Readiness</span>
                    </div>
                    <div className="cdc-quick-stats">
                      <div className="cdc-quick-stat">
                        <span className="cdc-qs-label">Active Backlogs</span>
                        <span className="cdc-qs-val" style={{ color: cdcP.activeBacklogs > 0 ? 'var(--error)' : 'var(--success)' }}>
                          {cdcP.activeBacklogs ?? 0}
                        </span>
                      </div>
                      <div className="cdc-quick-stat">
                        <span className="cdc-qs-label">Total Backlogs</span>
                        <span className="cdc-qs-val">{cdcP.totalBacklogs ?? 0}</span>
                      </div>
                      <div className="cdc-quick-stat">
                        <span className="cdc-qs-label">Problems Solved</span>
                        <span className="cdc-qs-val" style={{ color: 'var(--accent)' }}>{cdcP.codingProfile?.problemsSolved ?? 0}</span>
                      </div>
                      <div className="cdc-quick-stat">
                        <span className="cdc-qs-label">CP Rating</span>
                        <span className="cdc-qs-val" style={{ color: 'var(--primary)' }}>{cdcP.codingProfile?.rating ?? 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Coding Profile */}
                  <div className="cdc-section-box">
                    <div className="cdc-section-title"><Code2 size={16} /> Coding Profile</div>
                    <div className="cdc-cp-row">
                      <span className="cdc-badge badge-info">{cdcP.codingProfile?.platform || 'N/A'}</span>
                      <span className="cdc-cp-handle">@{cdcP.codingProfile?.handle}</span>
                      <span>Rating: <strong>{cdcP.codingProfile?.rating}</strong></span>
                      <span>Solved: <strong>{cdcP.codingProfile?.problemsSolved}</strong></span>
                    </div>
                  </div>

                  {/* Placement info */}
                  {student.placementStatus === 'Placed' && (
                    <div className="cdc-section-box success-box">
                      <div className="cdc-section-title"><Award size={16} /> Placement Details</div>
                      <div className="cdc-cp-row">
                        <span>Company: <strong>{cdcP.placedAt}</strong></span>
                        <span>CTC: <strong style={{ color: 'var(--success)' }}>{cdcP.ctcOffered}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Eligibility */}
                  <div className="cdc-section-box">
                    <div className="cdc-section-title"><CheckCircle2 size={16} /> Eligibility</div>
                    <div className="cdc-cp-row">
                      <span className={`cdc-badge ${badgeClass('eligibility', student.eligibilityStatus)}`}>{student.eligibilityStatus}</span>
                      <span className="cdc-muted">{cdcP.eligibilityReason}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="cdc-section-box">
                    <div className="cdc-section-title"><TrendingUp size={16} /> Skills</div>
                    <div className="cdc-skills-list">
                      {skills.length > 0 ? skills.map((sk, i) => (
                        <span key={i} className="cdc-skill-chip">{sk.name}</span>
                      )) : <span className="cdc-muted">No skills listed</span>}
                    </div>
                  </div>
                </div>
              )}

              {/* RESUME & ATS TAB */}
              {activeTab === 'resume' && (
                <div className="cdc-tab-resume animate-fade-in">
                  <div className="cdc-ats-hero glass-panel" style={{ background: 'rgba(129,140,248,0.05)' }}>
                    <div className="cdc-ats-score-block">
                      <ScoreRing score={student.atsScore} size={100} />
                      <div>
                        <div className="cdc-ats-title">ATS Score</div>
                        <div className="cdc-muted" style={{ fontSize: '0.85rem' }}>
                          {student.atsScore >= 75 ? '✅ Resume is ATS-optimized' : student.atsScore >= 55 ? '⚠️ Resume needs minor improvements' : '❌ Low ATS score — needs significant work'}
                        </div>
                      </div>
                    </div>
                    <a
                      href={cdcP.resumeUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      download
                    >
                      <Download size={16} /> Download Resume
                    </a>
                  </div>

                  <div className="cdc-section-box">
                    <div className="cdc-section-title">Skills in Resume</div>
                    <div className="cdc-skills-list">
                      {skills.map((sk, i) => (
                        <div key={i} className="cdc-skill-row">
                          <span className="cdc-skill-name">{sk.name}</span>
                          <div className="cdc-skill-bar-track">
                            <div className="cdc-skill-bar-fill" style={{ width: `${sk.level || 60}%` }} />
                          </div>
                          <span className="cdc-skill-pct">{sk.level || 60}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* APPLICATIONS TAB */}
              {activeTab === 'applications' && (
                <div className="cdc-tab-apps animate-fade-in">
                  {apps.length === 0 ? (
                    <div className="cdc-empty"><Briefcase size={40} color="var(--text-muted)" /><p>No applications yet</p></div>
                  ) : apps.map((app, i) => (
                    <div key={i} className="cdc-app-card glass-panel">
                      <div className="cdc-app-header">
                        <div>
                          <div className="cdc-app-company">{app.job?.company || 'Unknown'}</div>
                          <div className="cdc-muted">{app.job?.role} · {app.job?.type}</div>
                        </div>
                        <div>
                          <div>{app.job?.ctc}</div>
                          <span className={`cdc-badge ${badgeClass('appStatus', app.status)}`}>{app.status}</span>
                        </div>
                      </div>
                      {app.rounds?.length > 0 && (
                        <div className="cdc-rounds-list">
                          {app.rounds.map((r, ri) => (
                            <div key={ri} className={`cdc-round-row ${r.status}`}>
                              <span className="cdc-round-name">{r.name}</span>
                              <span className={`cdc-badge ${r.status === 'passed' ? 'badge-success' : r.status === 'failed' ? 'badge-error' : r.status === 'upcoming' ? 'badge-warning' : 'badge-muted'}`}>{r.status}</span>
                              {r.score && <span className="cdc-muted">{r.score}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TEST PERFORMANCE TAB */}
              {activeTab === 'tests' && (
                <div className="cdc-tab-tests animate-fade-in">
                  {tests.length === 0 ? (
                    <div className="cdc-empty"><Activity size={40} color="var(--text-muted)" /><p>No test data available</p></div>
                  ) : (
                    <>
                      <div className="cdc-test-chart">
                        {tests.map((t, i) => {
                          const pct = Math.round((t.score / t.total) * 100);
                          return (
                            <div key={i} className="cdc-test-bar-col">
                              <div className="cdc-test-bar-track">
                                <div
                                  className="cdc-test-bar-fill"
                                  style={{
                                    height: `${pct}%`,
                                    background: pct >= 75 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--error)'
                                  }}
                                />
                              </div>
                              <div className="cdc-test-bar-pct">{pct}%</div>
                              <div className="cdc-test-bar-label">{t.category}</div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="cdc-section-box" style={{ marginTop: '1.5rem' }}>
                        {tests.map((t, i) => (
                          <div key={i} className="cdc-test-row">
                            <span className="cdc-test-cat">{t.category}</span>
                            <span>{t.score} / {t.total}</span>
                            <span className={`cdc-badge ${Math.round((t.score / t.total) * 100) >= 75 ? 'badge-success' : Math.round((t.score / t.total) * 100) >= 50 ? 'badge-warning' : 'badge-error'}`}>
                              {Math.round((t.score / t.total) * 100)}%
                            </span>
                            <span className="cdc-muted">{new Date(t.date).toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* CDC NOTES TAB */}
              {activeTab === 'notes' && (
                <div className="cdc-tab-notes animate-fade-in">
                  <div className="cdc-note-input-area">
                    <textarea
                      className="cdc-note-textarea"
                      placeholder="Add a note about this student..."
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      rows={3}
                    />
                    <button
                      className="btn btn-primary cdc-note-save-btn"
                      onClick={handleAddNote}
                      disabled={savingNote || !noteText.trim()}
                    >
                      {savingNote ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                      Add Note
                    </button>
                  </div>

                  <div className="cdc-notes-list">
                    {notes.length === 0 ? (
                      <div className="cdc-empty"><StickyNote size={40} color="var(--text-muted)" /><p>No notes yet</p></div>
                    ) : notes.map((n, i) => (
                      <div key={i} className="cdc-note-item glass-panel">
                        <div className="cdc-note-text">{n.note}</div>
                        <div className="cdc-note-meta">
                          <span>By {n.addedByName}</span>
                          <span>{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CDCStudents() {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('All');
  const [placementStatus, setPlacementStatus] = useState('All');
  const [eligibility, setEligibility] = useState('All');
  const [minCgpa, setMinCgpa] = useState('');
  const [maxCgpa, setMaxCgpa] = useState('');

  // Fetch all students
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/cdc/students');
      setStudents(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError('Failed to load students. Make sure you are logged in as CDC.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // Client-side filtering
  useEffect(() => {
    let result = [...students];
    const q = search.toLowerCase();

    if (q) result = result.filter(s => s.name.toLowerCase().includes(q) || s.rollNo.toLowerCase().includes(q));
    if (branch !== 'All') result = result.filter(s => s.branch === branch);
    if (placementStatus !== 'All') result = result.filter(s => s.placementStatus === placementStatus);
    if (eligibility !== 'All') result = result.filter(s => s.eligibilityStatus === eligibility);
    if (minCgpa) result = result.filter(s => s.cgpa >= parseFloat(minCgpa));
    if (maxCgpa) result = result.filter(s => s.cgpa <= parseFloat(maxCgpa));

    setFiltered(result);
  }, [search, branch, placementStatus, eligibility, minCgpa, maxCgpa, students]);

  // Stats
  const total = students.length;
  const placed = students.filter(s => s.placementStatus === 'Placed').length;
  const eligible = students.filter(s => s.eligibilityStatus === 'Eligible').length;
  const avgCgpa = total > 0 ? (students.reduce((a, s) => a + s.cgpa, 0) / total).toFixed(2) : '0.00';

  // CSV Export
  const handleExport = () => {
    const headers = ['Name', 'Roll No', 'Branch', 'CGPA', 'ATS Score', 'CP Rating', 'Placement', 'Eligibility', 'App Status'];
    const rows = filtered.map(s => [
      s.name, s.rollNo, s.branch, s.cgpa, s.atsScore,
      s.codingProfile?.rating, s.placementStatus, s.eligibilityStatus, s.latestAppStatus
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click();
  };

  if (loading) return (
    <div className="flex-center" style={{ height: '70vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={48} color="var(--primary)" className="animate-spin" />
        <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading student data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex-center" style={{ height: '70vh' }}>
      <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
        <AlertCircle size={48} color="var(--error)" />
        <p style={{ marginTop: '1rem' }}>{error}</p>
        <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={fetchStudents}>Retry</button>
      </div>
    </div>
  );

  return (
    <div className="cdc-students-page animate-fade-in">
      {/* Page Header */}
      <div className="cdc-page-header">
        <div>
          <h1 className="cdc-page-title">Student <span className="gradient-text">Management</span></h1>
          <p className="cdc-page-subtitle">Complete overview of all registered students · {total} total</p>
        </div>
        <button className="btn btn-primary" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="cdc-stats-row">
        <StatCard icon={Users} label="Total Students" value={total} color="var(--primary)" />
        <StatCard icon={Award} label="Placed" value={placed} color="var(--success)" />
        <StatCard icon={CheckCircle2} label="Eligible" value={eligible} color="var(--accent)" />
        <StatCard icon={TrendingUp} label="Avg CGPA" value={avgCgpa} color="var(--warning)" />
      </div>

      {/* Filters */}
      <div className="cdc-filter-bar glass-panel">
        <div className="cdc-search-wrap">
          <Search size={16} className="cdc-search-icon" />
          <input
            id="cdc-search"
            className="cdc-search-input"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="cdc-filters-group">
          <div className="cdc-filter-select-wrap">
            <select id="cdc-filter-branch" className="cdc-filter-select" value={branch} onChange={e => setBranch(e.target.value)}>
              {BRANCH_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} className="cdc-select-arrow" />
          </div>

          <div className="cdc-filter-select-wrap">
            <select id="cdc-filter-placement" className="cdc-filter-select" value={placementStatus} onChange={e => setPlacementStatus(e.target.value)}>
              {PLACEMENT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} className="cdc-select-arrow" />
          </div>

          <div className="cdc-filter-select-wrap">
            <select id="cdc-filter-eligibility" className="cdc-filter-select" value={eligibility} onChange={e => setEligibility(e.target.value)}>
              {ELIGIBILITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} className="cdc-select-arrow" />
          </div>

          <input
            id="cdc-cgpa-min"
            type="number"
            className="cdc-cgpa-input"
            placeholder="Min CGPA"
            min="0" max="10" step="0.1"
            value={minCgpa}
            onChange={e => setMinCgpa(e.target.value)}
          />
          <input
            id="cdc-cgpa-max"
            type="number"
            className="cdc-cgpa-input"
            placeholder="Max CGPA"
            min="0" max="10" step="0.1"
            value={maxCgpa}
            onChange={e => setMaxCgpa(e.target.value)}
          />

          {(search || branch !== 'All' || placementStatus !== 'All' || eligibility !== 'All' || minCgpa || maxCgpa) && (
            <button className="btn btn-ghost cdc-clear-btn" onClick={() => { setSearch(''); setBranch('All'); setPlacementStatus('All'); setEligibility('All'); setMinCgpa(''); setMaxCgpa(''); }}>
              <X size={14} /> Clear
            </button>
          )}
        </div>

        <div className="cdc-filter-result-count">
          <Filter size={14} /> {filtered.length} of {total}
        </div>
      </div>

      {/* Table */}
      <div className="cdc-table-container glass-panel">
        <div className="cdc-table-scroll">
          <table className="cdc-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Roll No</th>
                <th>Branch</th>
                <th>CGPA</th>
                <th>ATS Score</th>
                <th>CP Rating</th>
                <th>App Status</th>
                <th>Placement</th>
                <th>Eligibility</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="cdc-table-empty">
                    <GraduationCap size={36} color="var(--text-muted)" />
                    <p>No students match the current filters</p>
                  </td>
                </tr>
              ) : filtered.map((s) => (
                <tr key={s._id} className="cdc-table-row" onClick={() => setSelectedStudent(s)}>
                  <td>
                    <div className="cdc-student-cell">
                      <div className="cdc-table-avatar">
                        {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="cdc-student-name">{s.name}</div>
                        <div className="cdc-muted" style={{ fontSize: '0.78rem' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="cdc-muted">{s.rollNo}</td>
                  <td><span className="cdc-badge badge-branch">{s.branch}</span></td>
                  <td style={{ color: cgpaColor(s.cgpa), fontWeight: 700 }}>{s.cgpa}</td>
                  <td><AtsBar score={s.atsScore} /></td>
                  <td>
                    <div className="cdc-cp-cell">
                      <span className="cdc-badge badge-info" style={{ fontSize: '0.7rem' }}>{s.codingProfile?.platform?.slice(0, 2)}</span>
                      <span style={{ fontWeight: 600 }}>{s.codingProfile?.rating}</span>
                    </div>
                  </td>
                  <td><span className={`cdc-badge ${badgeClass('appStatus', s.latestAppStatus)}`}>{s.latestAppStatus}</span></td>
                  <td><span className={`cdc-badge ${badgeClass('placement', s.placementStatus)}`}>{s.placementStatus}</span></td>
                  <td><span className={`cdc-badge ${badgeClass('eligibility', s.eligibilityStatus)}`}>{s.eligibilityStatus}</span></td>
                  <td>
                    <button
                      className="cdc-view-btn btn-ghost"
                      onClick={e => { e.stopPropagation(); setSelectedStudent(s); }}
                      title="View Profile"
                    >
                      <Eye size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profile Modal */}
      {selectedStudent && (
        <ProfileModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}
