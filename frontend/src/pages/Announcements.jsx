import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Send, Search, Filter, X, ChevronDown, Trash2,
  MessageSquare, Users, AlertCircle, Loader2, Eye, Flag
} from 'lucide-react';
import api from '../utils/api';
import './Announcements.css';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const BRANCH_OPTIONS = ['CSE', 'ICT', 'ECE', 'Mechanical', 'Civil', 'EE', 'Chemical'];
const AUDIENCE_TYPES = [
  { value: 'all', label: 'All Students', icon: '👥' },
  { value: 'eligible', label: 'Eligible Students', icon: '✓' },
  { value: 'branch', label: 'By Branch', icon: '📚' },
];
const PRIORITY_OPTIONS = ['low', 'medium', 'high'];

// ─── CREATE ANNOUNCEMENT MODAL ────────────────────────────────────────────────
function CreateAnnouncementModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    title: '',
    message: '',
    targetAudience: { type: 'all', branch: '' },
    priority: 'medium',
    pinned: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estimatedRecipients, setEstimatedRecipients] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.message.trim()) {
      setError('Title and message are required');
      return;
    }

    try {
      setLoading(true);
      await api.post('/announcements', form);
      alert('Announcement created successfully!');
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="announcement-modal glass-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create Announcement</h2>
          <button className="btn-close btn-ghost" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="announcement-form">
          {error && <div className="form-error">{error}</div>}

          {/* Title */}
          <div className="form-group">
            <label>Title *</label>
            <input
              placeholder="Announcement title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          {/* Message */}
          <div className="form-group">
            <label>Message *</label>
            <textarea
              placeholder="Write your announcement here..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              rows={5}
              required
            />
          </div>

          {/* Target Audience */}
          <div className="form-group">
            <label>Target Audience</label>
            <div className="audience-selector">
              {AUDIENCE_TYPES.map(t => (
                <button
                  key={t.value}
                  type="button"
                  className={`audience-btn ${form.targetAudience.type === t.value ? 'active' : ''}`}
                  onClick={() => setForm({ ...form, targetAudience: { ...form.targetAudience, type: t.value } })}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>

            {form.targetAudience.type === 'branch' && (
              <select
                value={form.targetAudience.branch}
                onChange={e => setForm({ ...form, targetAudience: { ...form.targetAudience, branch: e.target.value } })}
              >
                <option value="">Select Branch</option>
                {BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            )}
          </div>

          {/* Priority & Pinned */}
          <div className="form-row">
            <div className="form-group">
              <label>Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>

            <label className="checkbox-label">
              <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} />
              Pin this announcement
            </label>
          </div>

          {/* Estimated Recipients */}
          <div className="estimated-recipients">
            <Users size={16} />
            <span>Estimated Recipients: <strong>{estimatedRecipients === 0 ? 'Calculating...' : estimatedRecipients}</strong></span>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {loading ? 'Sending...' : 'Create Announcement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── ANNOUNCEMENT CARD ────────────────────────────────────────────────────────
function AnnouncementCard({ announcement, onDelete }) {
  const priorityColor = announcement.priority === 'high' ? '#ef4444' : announcement.priority === 'medium' ? '#f59e0b' : '#10b981';
  const readPercentage = announcement.recipientCount > 0 ? Math.round((announcement.read.count / announcement.recipientCount) * 100) : 0;

  return (
    <div className="announcement-card glass-panel">
      <div className="announcement-header">
        <div className="announcement-title-section">
          {announcement.pinned && <Flag size={14} color="#fbbf24" />}
          <div>
            <h3>{announcement.title}</h3>
            <p className="announcement-meta">
              By {announcement.createdByName} • {new Date(announcement.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <button
          className="btn-delete btn-ghost"
          onClick={() => onDelete(announcement._id)}
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <p className="announcement-message">{announcement.message}</p>

      <div className="announcement-footer">
        <div className="announcement-stats">
          <span className="stat-item">
            <Users size={14} /> {announcement.recipientCount} Recipients
          </span>
          <span className="stat-item">
            <Eye size={14} /> {readPercentage}% Read
          </span>
          <span className="priority-badge" style={{ background: `${priorityColor}18`, color: priorityColor }}>
            {announcement.priority.toUpperCase()}
          </span>
        </div>

        {/* Read Progress Bar */}
        <div className="read-bar-track">
          <div className="read-bar-fill" style={{ width: `${readPercentage}%`, background: '#10b981' }} />
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const user = JSON.parse(sessionStorage.getItem('user') || '{}') || {};
  const isCDC = user.role === 'cdc' || user.role === 'admin';

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = isCDC ? '/announcements/cdc/all' : '/announcements';
      const res = await api.get(endpoint);
      setAnnouncements(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError('Failed to load announcements');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }, [isCDC]);

  useEffect(() => { fetchAnnouncements(); }, [fetchAnnouncements]);

  useEffect(() => {
    let result = [...announcements];
    const q = search.toLowerCase();

    if (q) result = result.filter(a => a.title.toLowerCase().includes(q) || a.message.toLowerCase().includes(q));
    if (priorityFilter !== 'All') result = result.filter(a => a.priority === priorityFilter.toLowerCase());

    // Sort: pinned first, then by date
    result.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFiltered(result);
  }, [search, priorityFilter, announcements]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await api.delete(`/announcements/${id}`);
        setAnnouncements(announcements.filter(a => a._id !== id));
      } catch (err) {
        alert('Failed to delete announcement');
      }
    }
  };

  const stats = {
    total: announcements.length,
    sent: announcements.filter(a => a.status === 'sent').length,
    avgRead: announcements.length > 0
      ? Math.round(announcements.reduce((sum, a) => sum + (a.recipientCount > 0 ? (a.read.count / a.recipientCount) * 100 : 0), 0) / announcements.length)
      : 0
  };

  if (!isCDC && loading) {
    return (
      <div className="flex-center" style={{ height: '70vh' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 size={48} color="var(--primary)" className="animate-spin" />
          <p style={{ marginTop: '1rem' }}>Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="announcements-page animate-fade-in">
      {isCDC ? (
        // ─── CDC VIEW ────────────────────────────────────────────────────────
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Announcements <span className="gradient-text">Management</span></h1>
              <p className="page-subtitle">Create and manage student announcements · {stats.total} total</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Create Announcement
            </button>
          </div>

          {/* Stats */}
          <div className="stats-row">
            <div className="stat-card glass-panel">
              <div className="stat-icons-box">
                <MessageSquare size={22} color="var(--primary)" />
              </div>
              <div>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Announcements</div>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icons-box">
                <Send size={22} color="var(--success)" />
              </div>
              <div>
                <div className="stat-value">{stats.sent}</div>
                <div className="stat-label">Sent</div>
              </div>
            </div>

            <div className="stat-card glass-panel">
              <div className="stat-icons-box">
                <Eye size={22} color="var(--accent)" />
              </div>
              <div>
                <div className="stat-value">{stats.avgRead}%</div>
                <div className="stat-label">Avg Read Rate</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-bar glass-panel">
            <div className="search-wrap">
              <Search size={16} className="search-icon" />
              <input
                className="search-input"
                placeholder="Search announcements..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-select-wrap">
              <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                <option>All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
              <ChevronDown size={14} className="select-arrow" />
            </div>

            <div className="filter-result-count">
              <Filter size={14} /> {filtered.length} of {announcements.length}
            </div>
          </div>

          {/* Announcements List */}
          <div className="announcements-container">
            {filtered.length === 0 ? (
              <div className="empty-state glass-panel">
                <MessageSquare size={48} color="var(--text-muted)" />
                <p>No announcements created yet</p>
                <button className="btn btn-primary mt-4" onClick={() => setShowModal(true)}>
                  <Plus size={16} /> Create First Announcement
                </button>
              </div>
            ) : (
              filtered.map(announcement => (
                <AnnouncementCard
                  key={announcement._id}
                  announcement={announcement}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        // ─── STUDENT VIEW ───────────────────────────────────────────────────
        <div>
          <div className="page-header">
            <div>
              <h1 className="page-title">Announcements</h1>
              <p className="page-subtitle">Placement announcements from CDC · {stats.total} total</p>
            </div>
          </div>

          {/* Announcements List */}
          <div className="announcements-container">
            {loading ? (
              <div className="flex-center">
                <Loader2 size={48} className="animate-spin" color="var(--primary)" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-state glass-panel">
                <MessageSquare size={48} color="var(--text-muted)" />
                <p>No announcements yet</p>
              </div>
            ) : (
              filtered.map(announcement => (
                <div key={announcement._id} className="announcement-card glass-panel student-view">
                  {announcement.pinned && <div className="pinned-badge"><Flag size={12} /> Pinned</div>}
                  <h3>{announcement.title}</h3>
                  <p className="announcement-meta">
                    {new Date(announcement.createdAt).toLocaleDateString()} • {announcement.createdByName}
                  </p>
                  <p className="announcement-message">{announcement.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && isCDC && (
        <CreateAnnouncementModal
          onClose={() => setShowModal(false)}
          onSave={fetchAnnouncements}
        />
      )}
    </div>
  );
}
