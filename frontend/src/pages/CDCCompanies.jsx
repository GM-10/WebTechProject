import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, Filter, Eye, X, ChevronDown,
  Building2, Users, DollarSign, TrendingUp, Calendar,
  AlertCircle, Loader2, Briefcase, CheckCircle2, Tag,
  Clock, MapPin, Award, Download
} from 'lucide-react';
import api from '../utils/api';
import './CDCCompanies.css';

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const CTC_BRACKETS = [
  { label: 'All', min: 0, max: Infinity },
  { label: '1-7 LPA', min: 1, max: 7 },
  { label: '7-15 LPA', min: 7, max: 15 },
  { label: '15+ LPA', min: 15, max: Infinity }
];

const BRANCH_OPTIONS = ['All', 'CSE', 'ICT', 'ECE', 'Mechanical', 'Civil', 'EE', 'Chemical'];
const DRIVE_STATUS_OPTIONS = ['All', 'scheduled', 'active', 'completed', 'cancelled'];

const statusBadgeClass = (status) => {
  if (status === 'active') return 'badge-success';
  if (status === 'scheduled') return 'badge-info';
  if (status === 'completed') return 'badge-muted';
  return 'badge-error';
};

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

// ─── COMPANY CREATION MODAL ────────────────────────────────────────────────────
function CompanyModal({ onClose, onSave, existingCompany }) {
  const [form, setForm] = useState(existingCompany || {
    company: '',
    role: '',
    location: '',
    ctc: '',
    companyCTC: 0,
    deadline: '',
    description: '',
    driveStatus: 'scheduled',
    type: 'Full Time',
    tags: [],
    eligibilityCriteria: {
      minCGPA: 7.0,
      allowedBranches: [],
      maxTotalBacklogs: 0,
      allowActiveBacklogs: false,
      requiredSkills: [],
      alreadyPlacedRestriction: false,
    },
    roundDetails: [{ name: '', date: '', time: '' }],
    bondInfo: { hasBond: false, bondDuration: 0 }
  });

  const [skillInput, setSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleEligibilityChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      eligibilityCriteria: { ...prev.eligibilityCriteria, [field]: value }
    }));
  };

  const handleBranchToggle = (branch) => {
    setForm(prev => {
      const branches = prev.eligibilityCriteria.allowedBranches.includes(branch)
        ? prev.eligibilityCriteria.allowedBranches.filter(b => b !== branch)
        : [...prev.eligibilityCriteria.allowedBranches, branch];
      return {
        ...prev,
        eligibilityCriteria: { ...prev.eligibilityCriteria, allowedBranches: branches }
      };
    });
  };

  const addSkill = () => {
    if (skillInput.trim() && !form.eligibilityCriteria.requiredSkills.includes(skillInput)) {
      setForm(prev => ({
        ...prev,
        eligibilityCriteria: {
          ...prev.eligibilityCriteria,
          requiredSkills: [...prev.eligibilityCriteria.requiredSkills, skillInput]
        }
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      eligibilityCriteria: {
        ...prev.eligibilityCriteria,
        requiredSkills: prev.eligibilityCriteria.requiredSkills.filter(s => s !== skill)
      }
    }));
  };

  const handleRoundChange = (idx, field, value) => {
    const newRounds = [...form.roundDetails];
    newRounds[idx] = { ...newRounds[idx], [field]: value };
    setForm(prev => ({ ...prev, roundDetails: newRounds }));
  };

  const addRound = () => {
    setForm(prev => ({
      ...prev,
      roundDetails: [...prev.roundDetails, { name: '', date: '', time: '' }]
    }));
  };

  const removeRound = (idx) => {
    setForm(prev => ({
      ...prev,
      roundDetails: prev.roundDetails.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.company || !form.role || !form.location || !form.ctc || !form.deadline) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await api.post('/api/jobs', form);
      alert('Company/Drive created successfully!');
      onSave();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cdc-modal-backdrop" onClick={onClose}>
      <div className="cdc-modal glass-panel large-company-modal" onClick={e => e.stopPropagation()}>
        <div className="cdc-modal-header">
          <h2 className="cdc-modal-name">Add New Company / Drive</h2>
          <button className="cdc-modal-close btn-ghost" onClick={onClose}><X size={20} /></button>
        </div>

        <form className="company-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          {/* Basic Info */}
          <div className="company-form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <input placeholder="Company Name *" value={form.company} onChange={e => handleFormChange('company', e.target.value)} required />
              <input placeholder="Role *" value={form.role} onChange={e => handleFormChange('role', e.target.value)} required />
            </div>
            <div className="form-row">
              <input placeholder="Location *" value={form.location} onChange={e => handleFormChange('location', e.target.value)} required />
              <select value={form.type} onChange={e => handleFormChange('type', e.target.value)}>
                <option>Full Time</option>
                <option>Internship</option>
                <option>Contract</option>
              </select>
            </div>
            <div className="form-row">
              <input placeholder="CTC (e.g., ₹25 LPA) *" value={form.ctc} onChange={e => handleFormChange('ctc', e.target.value)} required />
              <input placeholder="Numeric CTC (LPA)" type="number" value={form.companyCTC} onChange={e => handleFormChange('companyCTC', parseFloat(e.target.value))} />
            </div>
            <div className="form-row">
              <input type="date" value={form.deadline} onChange={e => handleFormChange('deadline', e.target.value)} required />
              <select value={form.driveStatus} onChange={e => handleFormChange('driveStatus', e.target.value)}>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <textarea placeholder="Description" value={form.description} onChange={e => handleFormChange('description', e.target.value)} />
          </div>

          {/* Eligibility Criteria */}
          <div className="company-form-section">
            <h3>Eligibility Criteria</h3>
            <div className="form-row">
              <div>
                <label>Minimum CGPA</label>
                <input type="number" step="0.1" max="10" value={form.eligibilityCriteria.minCGPA} onChange={e => handleEligibilityChange('minCGPA', parseFloat(e.target.value))} />
              </div>
              <div>
                <label>Max Total Backlogs</label>
                <input type="number" min="0" value={form.eligibilityCriteria.maxTotalBacklogs} onChange={e => handleEligibilityChange('maxTotalBacklogs', parseInt(e.target.value))} />
              </div>
            </div>

            <label className="checkbox-label">
              <input type="checkbox" checked={form.eligibilityCriteria.allowActiveBacklogs} onChange={e => handleEligibilityChange('allowActiveBacklogs', e.target.checked)} />
              Allow Active Backlogs
            </label>
            <label className="checkbox-label">
              <input type="checkbox" checked={form.eligibilityCriteria.alreadyPlacedRestriction} onChange={e => handleEligibilityChange('alreadyPlacedRestriction', e.target.checked)} />
              Restrict Already Placed Students
            </label>

            <div>
              <label>Allowed Branches</label>
              <div className="branch-selector">
                {BRANCH_OPTIONS.filter(b => b !== 'All').map(branch => (
                  <button
                    key={branch}
                    type="button"
                    className={`branch-chip ${form.eligibilityCriteria.allowedBranches.includes(branch) ? 'active' : ''}`}
                    onClick={() => handleBranchToggle(branch)}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label>Required Skills</label>
              <div className="skill-input-group">
                <input placeholder="Add skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} />
                <button type="button" onClick={addSkill} className="btn btn-small btn-primary">Add</button>
              </div>
              <div className="skills-list">
                {form.eligibilityCriteria.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="skill-badge">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="skill-remove">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rounds */}
          <div className="company-form-section">
            <h3>Round Details</h3>
            {form.roundDetails.map((round, idx) => (
              <div key={idx} className="round-row">
                <input placeholder="Round Name" value={round.name} onChange={e => handleRoundChange(idx, 'name', e.target.value)} />
                <input type="date" value={round.date} onChange={e => handleRoundChange(idx, 'date', e.target.value)} />
                <input type="time" value={round.time} onChange={e => handleRoundChange(idx, 'time', e.target.value)} />
                <button type="button" onClick={() => removeRound(idx)} className="btn-remove">×</button>
              </div>
            ))}
            <button type="button" onClick={addRound} className="btn btn-small btn-ghost">+ Add Round</button>
          </div>

          {/* Bond Info */}
          <div className="company-form-section">
            <h3>Bond Information</h3>
            <label className="checkbox-label">
              <input type="checkbox" checked={form.bondInfo.hasBond} onChange={e => setForm(prev => ({ ...prev, bondInfo: { ...prev.bondInfo, hasBond: e.target.checked } }))} />
              Has Bond
            </label>
            {form.bondInfo.hasBond && (
              <input 
                type="number" 
                placeholder="Bond Duration (months)" 
                value={form.bondInfo.bondDuration} 
                onChange={e => setForm(prev => ({ ...prev, bondInfo: { ...prev.bondInfo, bondDuration: parseInt(e.target.value) } }))} 
              />
            )}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {loading ? 'Creating...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── COMPANY DETAIL MODAL ────────────────────────────────────────────────────
function CompanyDetailModal({ company, onClose }) {
  const [eligible, setEligible] = useState([]);
  const [ineligible, setIneligible] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEligibility = async () => {
      try {
        const res = await api.get(`/api/jobs/${company._id}/eligible-students`);
        setEligible(res.data.eligible);
        setIneligible(res.data.ineligible || []);
      } catch (err) {
        console.error('Failed to load eligibility:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEligibility();
  }, [company._id]);

  return (
    <div className="cdc-modal-backdrop" onClick={onClose}>
      <div className="cdc-modal glass-panel large-company-modal" onClick={e => e.stopPropagation()}>
        <div className="cdc-modal-header">
          <div>
            <h2 className="cdc-modal-name">{company.company} - {company.role}</h2>
            <span className={`cdc-badge ${statusBadgeClass(company.driveStatus || 'scheduled')}`}>
              {company.driveStatus || 'scheduled'}
            </span>
          </div>
          <button className="cdc-modal-close btn-ghost" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="company-detail-content">
          <div className="detail-grid">
            <div className="detail-item">
              <label>Location</label>
              <span>{company.location}</span>
            </div>
            <div className="detail-item">
              <label>CTC</label>
              <span style={{ fontWeight: 700, color: 'var(--success)' }}>{company.ctc}</span>
            </div>
            <div className="detail-item">
              <label>Type</label>
              <span>{company.type}</span>
            </div>
            <div className="detail-item">
              <label>Deadline</label>
              <span>{new Date(company.deadline).toLocaleDateString()}</span>
            </div>
            <div className="detail-item">
              <label>Applications</label>
              <span>{company.applicantsCount || 0}</span>
            </div>
            <div className="detail-item">
              <label>Selected</label>
              <span>{company.selectedCount || 0}</span>
            </div>
          </div>

          {company.description && (
            <div className="detail-section">
              <h3>Description</h3>
              <p>{company.description}</p>
            </div>
          )}

          <div className="detail-section">
            <h3>Eligibility Criteria</h3>
            <div className="criteria-list">
              <p>Minimum CGPA: <strong>{company.eligibilityCriteria?.minCGPA || 'N/A'}</strong></p>
              <p>Max Total Backlogs: <strong>{company.eligibilityCriteria?.maxTotalBacklogs ?? 'N/A'}</strong></p>
              <p>Allow Active Backlogs: <strong>{company.eligibilityCriteria?.allowActiveBacklogs ? 'Yes' : 'No'}</strong></p>
              {company.eligibilityCriteria?.allowedBranches?.length > 0 && (
                <p>Allowed Branches: <strong>{company.eligibilityCriteria.allowedBranches.join(', ')}</strong></p>
              )}
              {company.eligibilityCriteria?.requiredSkills?.length > 0 && (
                <p>Required Skills: <strong>{company.eligibilityCriteria.requiredSkills.join(', ')}</strong></p>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>Eligible Students: {eligible.length}</h3>
            {loading ? (
              <div className="flex-center"><Loader2 size={24} className="animate-spin" /></div>
            ) : eligible.length === 0 ? (
              <p className="text-muted">No eligible students</p>
            ) : (
              <p className="text-success">✓ {eligible.length} students are eligible</p>
            )}
          </div>

          {ineligible.length > 0 && (
            <div className="detail-section">
              <h3>Sample Ineligible Reasons</h3>
              <div className="ineligible-list">
                {ineligible.slice(0, 5).map((entry, idx) => (
                  <div key={idx} className="ineligible-item">
                    <span className="ineligible-name">{entry.studentName}</span>
                    <span className="ineligible-reason">{entry.reasons.join('; ')}</span>
                  </div>
                ))}
                {ineligible.length > 5 && <p className="text-muted">...and {ineligible.length - 5} more</p>}
              </div>
            </div>
          )}

          {company.bondInfo?.hasBond && (
            <div className="detail-section alert-box">
              <h3>Bond Information</h3>
              <p>Bond Duration: <strong>{company.bondInfo.bondDuration} months</strong></p>
            </div>
          )}

          {company.roundDetails?.length > 0 && (
            <div className="detail-section">
              <h3>Round Schedule</h3>
              <div className="rounds-list">
                {company.roundDetails.map((round, idx) => (
                  <div key={idx} className="round-detail-item">
                    <span className="round-name">{round.name}</span>
                    {round.date && <span className="round-date">{new Date(round.date).toLocaleDateString()}</span>}
                    {round.time && <span className="round-time">{round.time}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function CDCCompanies() {
  const [companies, setCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [ctcBracket, setCtcBracket] = useState('All');
  const [driveStatus, setDriveStatus] = useState('All');
  const [sortBy, setSortBy] = useState('ctc-desc');

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/jobs/cdc/all');
      setCompanies(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  useEffect(() => {
    let result = [...companies];
    const q = search.toLowerCase();

    if (q) result = result.filter(c => c.company.toLowerCase().includes(q) || c.role.toLowerCase().includes(q));
    if (ctcBracket !== 'All') {
      const bracket = CTC_BRACKETS.find(b => b.label === ctcBracket);
      result = result.filter(c => (c.companyCTC || 0) >= bracket.min && (c.companyCTC || 0) <= bracket.max);
    }
    if (driveStatus !== 'All') result = result.filter(c => (c.driveStatus || 'scheduled') === driveStatus);

    // Sorting
    if (sortBy === 'ctc-desc') result.sort((a, b) => (b.companyCTC || 0) - (a.companyCTC || 0));
    else if (sortBy === 'ctc-asc') result.sort((a, b) => (a.companyCTC || 0) - (b.companyCTC || 0));
    else if (sortBy === 'deadline') result.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    setFiltered(result);
  }, [search, ctcBracket, driveStatus, sortBy, companies]);

  const stats = {
    total: companies.length,
    active: companies.filter(c => (c.driveStatus || 'scheduled') === 'active').length,
    totalCTC: companies.reduce((sum, c) => sum + (c.companyCTC || 0), 0),
    avgCTC: companies.length > 0 ? (companies.reduce((sum, c) => sum + (c.companyCTC || 0), 0) / companies.length).toFixed(1) : 0
  };

  if (loading) return (
    <div className="flex-center" style={{ height: '70vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={48} color="var(--primary)" className="animate-spin" />
        <p style={{ marginTop: '1rem' }}>Loading companies...</p>
      </div>
    </div>
  );

  return (
    <div className="cdc-companies-page animate-fade-in">
      {/* Header */}
      <div className="cdc-page-header">
        <div>
          <h1 className="cdc-page-title">Company <span className="gradient-text">Management</span></h1>
          <p className="cdc-page-subtitle">Manage recruitment drives and companies · {stats.total} total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Company
        </button>
      </div>

      {/* Stats */}
      <div className="cdc-stats-row">
        <StatCard icon={Building2} label="Total Companies" value={stats.total} color="var(--primary)" />
        <StatCard icon={Clock} label="Active Drives" value={stats.active} color="var(--success)" />
        <StatCard icon={DollarSign} label="Avg CTC" value={`₹${stats.avgCTC} LPA`} color="var(--accent)" />
        <StatCard icon={TrendingUp} label="Highest CTC" value={`₹${Math.max(...companies.map(c => c.companyCTC || 0), 0)} LPA`} color="var(--warning)" />
      </div>

      {/* Filters */}
      <div className="cdc-filter-bar glass-panel">
        <div className="cdc-search-wrap">
          <Search size={16} className="cdc-search-icon" />
          <input className="cdc-search-input" placeholder="Search companies..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="cdc-filters-group">
          <div className="cdc-filter-select-wrap">
            <select className="cdc-filter-select" value={ctcBracket} onChange={e => setCtcBracket(e.target.value)}>
              {CTC_BRACKETS.map(b => <option key={b.label}>{b.label}</option>)}
            </select>
            <ChevronDown size={14} className="cdc-select-arrow" />
          </div>

          <div className="cdc-filter-select-wrap">
            <select className="cdc-filter-select" value={driveStatus} onChange={e => setDriveStatus(e.target.value)}>
              {DRIVE_STATUS_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <ChevronDown size={14} className="cdc-select-arrow" />
          </div>

          <div className="cdc-filter-select-wrap">
            <select className="cdc-filter-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="ctc-desc">Highest CTC</option>
              <option value="ctc-asc">Lowest CTC</option>
              <option value="deadline">Earliest Deadline</option>
            </select>
            <ChevronDown size={14} className="cdc-select-arrow" />
          </div>
        </div>

        <div className="cdc-filter-result-count">
          <Filter size={14} /> {filtered.length} of {companies.length}
        </div>
      </div>

      {/* Table */}
      <div className="cdc-table-container glass-panel">
        <div className="cdc-table-scroll">
          <table className="cdc-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>CTC</th>
                <th>Location</th>
                <th>Type</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Applicants</th>
                <th>Selected</th>
                <th>Eligible</th>
                <th>Bond</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={12} className="cdc-table-empty">
                    <Building2 size={36} color="var(--text-muted)" />
                    <p>No companies match the filters</p>
                  </td>
                </tr>
              ) : filtered.map((company) => (
                <tr key={company._id} className="cdc-table-row">
                  <td>
                    <div className="cdc-company-cell">
                      <div className="cdc-table-avatar" style={{ background: company.logoColor }}>
                        {company.logo}
                      </div>
                      <div>
                        <div className="cdc-company-name">{company.company}</div>
                        <div className="cdc-muted" style={{ fontSize: '0.78rem' }}>{company.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="cdc-muted">{company.role}</td>
                  <td style={{ fontWeight: 700, color: 'var(--success)' }}>{company.ctc}</td>
                  <td className="cdc-muted">{company.location}</td>
                  <td><span className="cdc-badge badge-info">{company.type}</span></td>
                  <td className="cdc-muted">{new Date(company.deadline).toLocaleDateString()}</td>
                  <td><span className={`cdc-badge ${statusBadgeClass(company.driveStatus || 'scheduled')}`}>{company.driveStatus || 'scheduled'}</span></td>
                  <td style={{ fontWeight: 600 }}>{company.applicantsCount || 0}</td>
                  <td style={{ fontWeight: 600, color: 'var(--success)' }}>{company.selectedCount || 0}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{company.eligibleCount || 0}</td>
                  <td>{company.bondInfo?.hasBond ? <span className="cdc-badge badge-warning">Yes</span> : <span className="cdc-badge badge-muted">No</span>}</td>
                  <td>
                    <button
                      className="cdc-view-btn btn-ghost"
                      onClick={() => setSelectedCompany(company)}
                      title="View Details"
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

      {/* Modals */}
      {showModal && <CompanyModal onClose={() => setShowModal(false)} onSave={fetchCompanies} />}
      {selectedCompany && <CompanyDetailModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />}
    </div>
  );
}
