import React, { useState, useEffect } from 'react';
import { X, Loader2, Plus } from 'lucide-react';
import api from '../utils/api';
import '../pages/CDCCompanies.css';

const BRANCH_OPTIONS = ['All', 'CSE', 'ICT', 'ECE', 'Mechanical', 'Civil', 'EE', 'Chemical'];

export default function CompanyModal({ onClose, onSave, existingCompany }) {
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
  const [existingCompaniesList, setExistingCompaniesList] = useState([]);

  useEffect(() => {
    // Fetch all existing jobs to extract a unique list of companies
    // for intelligent auto-completion in the form dropdown.
    api.get('/jobs/cdc/all').then(res => {
      const companies = res.data.map(job => job.company).filter(Boolean);
      const uniqueCompanies = [...new Set(companies)].sort();
      setExistingCompaniesList(uniqueCompanies);
    }).catch(err => console.error("Failed to fetch companies list", err));
  }, []);

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
      await api.post('/jobs', form);
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
    <div className="cdc-modal-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="cdc-modal glass-panel large-company-modal" onClick={e => e.stopPropagation()}>
        <div className="cdc-modal-header">
          <h2 className="cdc-modal-name">Add New Company / Drive</h2>
          <button className="cdc-modal-close btn-ghost" onClick={onClose} type="button"><X size={20} /></button>
        </div>

        <form className="company-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          {/* Basic Info */}
          <div className="company-form-section">
            <h3>Basic Information</h3>
            <div className="form-row">
              <input 
                list="company-autocomplete"
                placeholder="Company Name *" 
                value={form.company} 
                onChange={e => handleFormChange('company', e.target.value)} 
                required 
              />
              <datalist id="company-autocomplete">
                {existingCompaniesList.map(c => <option key={c} value={c} />)}
              </datalist>
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

            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={form.eligibilityCriteria.allowActiveBacklogs} onChange={e => handleEligibilityChange('allowActiveBacklogs', e.target.checked)} />
              Allow Active Backlogs
            </label>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={form.eligibilityCriteria.alreadyPlacedRestriction} onChange={e => handleEligibilityChange('alreadyPlacedRestriction', e.target.checked)} />
              Restrict Already Placed Students
            </label>

            <div>
              <label>Allowed Branches</label>
              <div className="branch-selector" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {BRANCH_OPTIONS.filter(b => b !== 'All').map(branch => (
                  <button
                    key={branch}
                    type="button"
                    className={`branch-chip ${form.eligibilityCriteria.allowedBranches.includes(branch) ? 'active' : ''}`}
                    onClick={() => handleBranchToggle(branch)}
                    style={{ padding: '4px 12px', border: '1px solid var(--glass-border)', borderRadius: '16px', background: form.eligibilityCriteria.allowedBranches.includes(branch) ? 'var(--primary)' : 'transparent', color: form.eligibilityCriteria.allowedBranches.includes(branch) ? 'white' : 'var(--text-main)', cursor: 'pointer' }}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label>Required Skills</label>
              <div className="skill-input-group" style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <input placeholder="Add skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addSkill())} style={{ flex: 1 }} />
                <button type="button" onClick={addSkill} className="btn btn-small btn-primary">Add</button>
              </div>
              <div className="skills-list" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                {form.eligibilityCriteria.requiredSkills.map((skill, idx) => (
                  <span key={idx} className="skill-badge" style={{ background: 'var(--overlay-medium)', padding: '4px 12px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="skill-remove" style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', padding: 0 }}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rounds */}
          <div className="company-form-section">
            <h3>Round Details</h3>
            {form.roundDetails.map((round, idx) => (
              <div key={idx} className="round-row" style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input placeholder="Round Name" value={round.name} onChange={e => handleRoundChange(idx, 'name', e.target.value)} style={{ flex: 2 }} />
                <input type="date" value={round.date} onChange={e => handleRoundChange(idx, 'date', e.target.value)} style={{ flex: 1 }} />
                <input type="time" value={round.time} onChange={e => handleRoundChange(idx, 'time', e.target.value)} style={{ flex: 1 }} />
                <button type="button" onClick={() => removeRound(idx)} className="btn-remove" style={{ background: 'var(--error)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0 8px' }}>&times;</button>
              </div>
            ))}
            <button type="button" onClick={addRound} className="btn btn-small btn-ghost">+ Add Round</button>
          </div>

          {/* Bond Info */}
          <div className="company-form-section">
            <h3>Bond Information</h3>
            <label className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" checked={form.bondInfo.hasBond} onChange={e => setForm(prev => ({ ...prev, bondInfo: { ...prev.bondInfo, hasBond: e.target.checked } }))} />
              Has Bond
            </label>
            {form.bondInfo.hasBond && (
              <input 
                type="number" 
                placeholder="Bond Duration (months)" 
                value={form.bondInfo.bondDuration} 
                onChange={e => setForm(prev => ({ ...prev, bondInfo: { ...prev.bondInfo, bondDuration: parseInt(e.target.value) } }))} 
                style={{ marginTop: '8px' }}
              />
            )}
          </div>

          {/* Actions */}
          <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {loading ? 'Creating...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
