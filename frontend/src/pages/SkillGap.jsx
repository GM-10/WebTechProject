import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, CheckCircle2, AlertCircle, BookOpen, Sparkles, BookMarked, BrainCircuit, ExternalLink } from 'lucide-react';
import api from '../utils/api';
import './SkillGap.css';

export default function SkillGap() {
  const [currentSkills, setCurrentSkills] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkillGap = async () => {
      try {
        setLoading(true);
        const res = await api.get('/profile/skill-gap');
        setCurrentSkills(Array.isArray(res.data?.currentSkills) ? res.data.currentSkills : []);
        setRoles(Array.isArray(res.data?.roles) ? res.data.roles : []);
        setSelectedRole((prev) => prev || (Array.isArray(res.data?.roles) ? res.data.roles[0] : null));
        setError('');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to load skill-gap analysis.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkillGap();
  }, []);

  const handleRoleSelect = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (role) setSelectedRole(role);
  };

  const getGapStatus = (current, required) => {
    const diff = current - required;
    if (diff >= 0) return { type: 'success', text: 'Proficient', icon: CheckCircle2 };
    if (diff >= -20) return { type: 'warning', text: 'Needs Improvement', icon: TrendingUp };
    return { type: 'error', text: 'Critical Gap', icon: AlertCircle };
  };

  return (
    <div className="sg-container animate-fade-in stagger-1">
      {loading && (
        <div className="panel glass-panel mb-6">
          Loading live skill-gap analysis...
        </div>
      )}

      {error && (
        <div className="panel glass-panel mb-6" style={{ color: 'var(--error)' }}>
          {error}
        </div>
      )}

      <div className="sg-header">
        <div>
          <h1 className="sg-heading">Skill Gap <span className="gradient-text">Analysis</span></h1>
          <p className="sg-subheading">Compare your current skill profile against industry standards for your dream roles</p>
        </div>
      </div>

      <div className="sg-grid">
        {/* Left Col - Role Selection & Stats */}
        <div className="sg-col-side">
          {/* Role Selector */}
          <div className="panel glass-panel sg-role-panel mb-6 animate-fade-in stagger-2">
            <h3 className="panel-title mb-4"><Target size={18} /> Target Roles</h3>
            <div className="role-options">
              {roles.map(role => (
                <button 
                  key={role.id}
                  className={`role-select-btn ${selectedRole?.id === role.id ? 'active' : ''}`}
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <div className="role-btn-info">
                    <h4>{role.title}</h4>
                    <span>{role.companyLevel}</span>
                  </div>
                  <div className="role-btn-match" style={{ 
                    color: role.match > 70 ? 'var(--success)' : role.match > 50 ? 'var(--warning)' : 'var(--error)',
                    backgroundColor: role.match > 70 ? 'rgba(16, 185, 129, 0.1)' : role.match > 50 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                  }}>
                    {role.match}% Match
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* AI Insights */}
          <div className="panel glass-panel gradient-border-panel animate-fade-in stagger-3">
            <div className="panel-header mb-4">
              <h3 className="panel-title"><Sparkles size={18} color="var(--primary)" /> AI Insights</h3>
            </div>
            <div className="insight-box">
              <p>{selectedRole?.insight || 'Live skill-gap analysis will appear here once your profile is loaded.'}</p>
              {currentSkills.length > 0 && (
                <p className="mt-4">
                  Current strengths: <strong>{currentSkills.slice(0, 4).map((skill) => skill.name).join(', ')}</strong>
                </p>
              )}
              
              <div className="insight-recommendation mt-4">
                <BrainCircuit size={16} /> Focus next 3 weeks entirely on architectural patterns and scalability concepts.
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Detailed Analysis */}
        <div className="sg-col-main">
          {selectedRole && (
            <>
              {/* Top Overview */}
              <div className="panel glass-panel animate-fade-in stagger-2 mb-6">
                <div className="sg-role-header">
                  <div className="sg-role-header-text">
                    <h2>{selectedRole.title}</h2>
                    <p>{selectedRole.companyLevel}</p>
                  </div>
                  <div className="sg-role-match-circle">
                    <svg viewBox="0 0 36 36" className="score-circular-chart">
                      <path className="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="score-fill" 
                        strokeDasharray={`${selectedRole.match}, 100`} 
                        style={{stroke: selectedRole.match > 70 ? 'var(--success)' : selectedRole.match > 50 ? 'var(--warning)' : 'var(--error)'}}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      />
                      <text x="18" y="20.35" className="score-value">{selectedRole.match}%</text>
                    </svg>
                    <span className="score-label">Readiness Rating</span>
                  </div>
                </div>
              </div>

              {/* Skills Table Breakdown */}
              <div className="panel glass-panel animate-fade-in stagger-3 mb-6">
                <h3 className="panel-title mb-4">Detailed Skill Breakdown</h3>
                <div className="skills-breakdown-list">
                  {selectedRole.requiredSkills.map((skill, idx) => {
                    const status = getGapStatus(skill.currentLevel, skill.reqLevel);
                    const Icon = status.icon;
                    
                    return (
                      <div key={idx} className="skill-gap-row">
                        <div className="sgr-info">
                          <div className="sgr-name-row">
                            <h4>{skill.name}</h4>
                            <span className="sgr-category">{skill.category}</span>
                          </div>
                          <div className="sgr-status" style={{ color: `var(--${status.type})` }}>
                            <Icon size={14} /> {status.text}
                          </div>
                        </div>

                        <div className="sgr-bars">
                          <div className="sgr-bar-group">
                            <span className="sgr-bar-label">You: {skill.currentLevel}%</span>
                            <div className="sgr-track">
                              <div className="sgr-fill current" style={{ width: `${skill.currentLevel}%`, background: `var(--${status.type})`}}></div>
                            </div>
                          </div>
                          <div className="sgr-bar-group">
                            <span className="sgr-bar-label">Req: {skill.reqLevel}%</span>
                            <div className="sgr-track">
                              <div className="sgr-fill target" style={{ width: `${skill.reqLevel}%` }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Learning Recommendations */}
              <div className="panel glass-panel animate-fade-in stagger-4">
                <h3 className="panel-title mb-4"><BookOpen size={18} /> Recommended Learning Path</h3>
                <div className="sg-courses-grid">
                  {selectedRole.recommendedCourses.map((course, idx) => (
                    <div key={idx} className="course-card">
                      <div className="course-type-badge"><BookMarked size={12} /> {course.type}</div>
                      <h4>{course.title}</h4>
                      <p className="course-platform">{course.platform}</p>
                      <div className="course-tags">
                        {course.tags.map(t => <span key={t} className="c-tag">{t}</span>)}
                      </div>
                      <button className="btn btn-ghost border-btn w-full mt-4" style={{justifyContent: 'center', fontSize: '0.85rem'}}>
                        View Course <ExternalLink size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
