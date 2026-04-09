import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Upload,
  FileText,
  Plus,
  X,
  Pencil,
  Check,
  Briefcase,
  Globe,
  Link,
  Trophy,
  Star,
  Calendar
} from 'lucide-react';
import './Profile.css';

const initialProfile = {
  name: 'Alex JD',
  email: 'alex.jd@university.edu',
  phone: '+91 98765 43210',
  location: 'Mumbai, India',
  department: 'Computer Science',
  year: '4th Year',
  cgpa: '8.7',
  rollNo: 'CS2022001',
  bio: 'Passionate full-stack developer with a keen interest in distributed systems and cloud computing. Active competitive programmer and open-source contributor.',
  github: 'github.com/alexjd',
  linkedin: 'linkedin.com/in/alexjd',
  portfolio: 'alexjd.dev',
  resumeFileName: null,
};

const initialSkills = [
  { name: 'React.js', level: 90 },
  { name: 'Java', level: 85 },
  { name: 'Node.js', level: 80 },
  { name: 'MongoDB', level: 75 },
  { name: 'Spring Boot', level: 70 },
  { name: 'Docker', level: 65 },
  { name: 'AWS', level: 60 },
  { name: 'Python', level: 85 },
];

const education = [
  {
    degree: 'B.Tech in Computer Science',
    institution: 'Indian Institute of Technology',
    year: '2022 – 2026',
    grade: 'CGPA: 8.7/10',
    status: 'current',
  },
  {
    degree: 'Higher Secondary (XII)',
    institution: 'Delhi Public School',
    year: '2020 – 2022',
    grade: '96.4%',
    status: 'completed',
  },
  {
    degree: 'Secondary (X)',
    institution: 'Delhi Public School',
    year: '2020',
    grade: '97.2%',
    status: 'completed',
  },
];

const achievements = [
  { title: 'Google Summer of Code 2025', icon: Trophy, color: 'var(--warning)' },
  { title: 'ACM ICPC Regionalist', icon: Star, color: 'var(--primary)' },
  { title: 'Smart India Hackathon Finalist', icon: Trophy, color: 'var(--secondary)' },
];

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [skills, setSkills] = useState(initialSkills);
  const [eduList, setEduList] = useState(education);
  const [achList, setAchList] = useState(achievements);
  const [isEditing, setIsEditing] = useState(false);
  const [editProfile, setEditProfile] = useState(initialProfile);
  const [newSkill, setNewSkill] = useState('');
  const [resumeDragging, setResumeDragging] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        const data = res.data;
        setProfile(data);
        setEditProfile(data);
        if (data.skills) {
          const normalizedSkills = data.skills.map((skill) => {
            if (typeof skill === 'string') {
              return { name: skill, level: 50 };
            }
            return {
              ...skill,
              level: Number.isFinite(Number(skill.level)) ? Number(skill.level) : 50
            };
          });
          setSkills(normalizedSkills);
        }
        if (data.education) setEduList(data.education);
        if (data.achievements) setAchList(data.achievements);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await api.post('/profile', {
        ...editProfile,
        skills,
        education: eduList,
        achievements: achList
      });
      setProfile(res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile. Make sure you are logged in.');
    }
  };

  const handleCancel = () => {
    setEditProfile(profile);
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.find(s => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      setSkills([...skills, { name: newSkill.trim(), level: 50 }]);
      setNewSkill('');
    }
  };

  const removeSkill = (name) => {
    setSkills(skills.filter(s => s.name !== name));
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfile(prev => ({ ...prev, resumeFileName: file.name }));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setResumeDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setProfile(prev => ({ ...prev, resumeFileName: file.name }));
    }
  };

  const visibleSkills = skills;

  const getSkillLevel = (skill) => {
    const parsed = Number(skill?.level);
    if (!Number.isFinite(parsed)) return 0;
    return Math.max(0, Math.min(100, Math.round(parsed)));
  };

  const getSkillColor = (level) => {
    if (level >= 80) return 'var(--success)';
    if (level >= 60) return 'var(--primary)';
    if (level >= 40) return 'var(--warning)';
    return 'var(--error)';
  };

  if (loading) {
    return (
      <div className="profile-container animate-fade-in stagger-1">
        <div className="coming-soon-page">
          <h2>Loading...</h2>
          <p>Please wait while we fetch your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container animate-fade-in stagger-1">
      {/* Profile Header Card */}
      <div className="profile-header glass-panel">
        <div className="profile-header-bg"></div>
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar-wrapper">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Profile"
                className="profile-avatar"
              />
              <button className="avatar-edit-btn" title="Change photo">
                <Pencil size={14} />
              </button>
            </div>
            <div className="profile-identity">
              <h1 className="profile-name">{profile.name}</h1>
              <p className="profile-dept">
                <GraduationCap size={16} />
                {profile.department} • {profile.year}
              </p>
              <p className="profile-roll">Roll No: {profile.rollNo}</p>
            </div>
          </div>
          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="btn btn-ghost border-btn" onClick={handleCancel}>
                  <X size={16} /> Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  <Check size={16} /> Save Changes
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => { setEditProfile(profile); setIsEditing(true); }}>
                <Pencil size={16} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="profile-quick-stats">
          <div className="pq-stat">
            <span className="pq-value gradient-text">{profile.cgpa}</span>
            <span className="pq-label">CGPA</span>
          </div>
          <div className="pq-divider"></div>
          <div className="pq-stat">
            <span className="pq-value" style={{ color: 'var(--success)' }}>{skills.length}</span>
            <span className="pq-label">Skills</span>
          </div>
          <div className="pq-divider"></div>
          <div className="pq-stat">
            <span className="pq-value" style={{ color: 'var(--accent)' }}>{achList.length}</span>
            <span className="pq-label">Achievements</span>
          </div>
          <div className="pq-divider"></div>
          <div className="pq-stat">
            <span className="pq-value" style={{ color: 'var(--warning)' }}>12</span>
            <span className="pq-label">Applications</span>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        {/* Left Column */}
        <div className="profile-col-main">
          {/* Personal Info */}
          <div className="panel glass-panel animate-fade-in stagger-2">
            <div className="panel-header">
              <h3 className="panel-title"><User size={20} /> Personal Information</h3>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label><Mail size={14} /> Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    className="edit-input"
                    value={editProfile.email}
                    onChange={e => setEditProfile({ ...editProfile, email: e.target.value })}
                  />
                ) : (
                  <span>{profile.email}</span>
                )}
              </div>
              <div className="info-item">
                <label><Phone size={14} /> Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    className="edit-input"
                    value={editProfile.phone}
                    onChange={e => setEditProfile({ ...editProfile, phone: e.target.value })}
                  />
                ) : (
                  <span>{profile.phone}</span>
                )}
              </div>
              <div className="info-item">
                <label><MapPin size={14} /> Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="edit-input"
                    value={editProfile.location}
                    onChange={e => setEditProfile({ ...editProfile, location: e.target.value })}
                  />
                ) : (
                  <span>{profile.location}</span>
                )}
              </div>
              <div className="info-item">
                <label><GraduationCap size={14} /> CGPA</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="edit-input"
                    value={editProfile.cgpa}
                    onChange={e => setEditProfile({ ...editProfile, cgpa: e.target.value })}
                  />
                ) : (
                  <span>{profile.cgpa} / 10</span>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="info-bio">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  className="edit-textarea"
                  value={editProfile.bio}
                  onChange={e => setEditProfile({ ...editProfile, bio: e.target.value })}
                  rows={3}
                />
              ) : (
                <p>{profile.bio}</p>
              )}
            </div>

            {/* Social Links */}
            <div className="social-links">
              <a href="#" className="social-link" title="GitHub">
                <Link size={18} />
                <span>{isEditing ? (
                  <input
                    type="text"
                    className="edit-input-inline"
                    value={editProfile.github}
                    onChange={e => setEditProfile({ ...editProfile, github: e.target.value })}
                  />
                ) : profile.github}</span>
              </a>
              <a href="#" className="social-link" title="LinkedIn">
                <Link size={18} />
                <span>{isEditing ? (
                  <input
                    type="text"
                    className="edit-input-inline"
                    value={editProfile.linkedin}
                    onChange={e => setEditProfile({ ...editProfile, linkedin: e.target.value })}
                  />
                ) : profile.linkedin}</span>
              </a>
              <a href="#" className="social-link" title="Portfolio">
                <Globe size={18} />
                <span>{isEditing ? (
                  <input
                    type="text"
                    className="edit-input-inline"
                    value={editProfile.portfolio}
                    onChange={e => setEditProfile({ ...editProfile, portfolio: e.target.value })}
                  />
                ) : profile.portfolio}</span>
              </a>
            </div>
          </div>

          {/* Education */}
          <div className="panel glass-panel animate-fade-in stagger-3">
            <div className="panel-header">
              <h3 className="panel-title"><GraduationCap size={20} /> Education</h3>
            </div>
            <div className="education-timeline">
              {eduList.map((edu, idx) => (
                <div key={idx} className={`edu-item ${edu.status === 'current' ? 'current' : ''}`}>
                  <div className="edu-timeline-dot"></div>
                  <div className="edu-content">
                    <div className="edu-header">
                      <h4>{edu.degree}</h4>
                      {edu.status === 'current' && <span className="current-badge">Current</span>}
                    </div>
                    <p className="edu-institution">{edu.institution}</p>
                    <div className="edu-meta">
                      <span><Calendar size={14} /> {edu.year}</span>
                      <span className="edu-grade">{edu.grade}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-col-side">
          {/* Resume Upload */}
          <div className="panel glass-panel animate-fade-in stagger-2">
            <div className="panel-header">
              <h3 className="panel-title"><FileText size={20} /> Resume</h3>
            </div>
            <div
              className={`resume-upload-zone ${resumeDragging ? 'dragging' : ''} ${profile.resumeFileName ? 'has-file' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setResumeDragging(true); }}
              onDragLeave={() => setResumeDragging(false)}
              onDrop={handleDrop}
            >
              {profile.resumeFileName ? (
                <div className="resume-uploaded">
                  <div className="resume-file-icon">
                    <FileText size={32} color="var(--primary)" />
                  </div>
                  <p className="resume-filename">{profile.resumeFileName}</p>
                  <p className="resume-status">Uploaded successfully</p>
                  <label className="btn btn-ghost border-btn resume-change-btn">
                    <Upload size={14} /> Replace
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      hidden
                    />
                  </label>
                </div>
              ) : (
                <div className="resume-placeholder">
                  <div className="upload-icon-wrapper">
                    <Upload size={28} color="var(--primary)" />
                  </div>
                  <p className="upload-title">Drag & drop your resume</p>
                  <p className="upload-subtitle">or</p>
                  <label className="btn btn-primary upload-btn">
                    <Upload size={16} /> Browse Files
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      hidden
                    />
                  </label>
                  <p className="upload-hint">PDF, DOC, DOCX — Max 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="panel glass-panel animate-fade-in stagger-3">
            <div className="panel-header">
              <h3 className="panel-title"><Briefcase size={20} /> Skills</h3>
            </div>
            <div className="skills-list">
              {visibleSkills.map((skill) => (
                <div key={skill.name} className="skill-row">
                  {(() => {
                    const skillLevel = getSkillLevel(skill);
                    const skillColor = getSkillColor(skillLevel);
                    return (
                      <>
                  <div className="skill-info">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level" style={{ color: skillColor }}>{skillLevel}%</span>
                  </div>
                  <div className="skill-bar-track">
                    <div
                      className="skill-bar-fill"
                      style={{
                        width: `${skillLevel}%`,
                        background: `linear-gradient(90deg, ${skillColor}, ${skillColor}88)`
                      }}
                    ></div>
                  </div>
                      </>
                    );
                  })()}
                  {isEditing && (
                    <button className="skill-remove" onClick={() => removeSkill(skill.name)}>
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="add-skill-row">
                <input
                  type="text"
                  className="edit-input"
                  placeholder="Add a new skill..."
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSkill()}
                />
                <button className="btn btn-primary add-skill-btn" onClick={addSkill}>
                  <Plus size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Achievements */}
          <div className="panel glass-panel gradient-border-panel animate-fade-in stagger-4">
            <div className="panel-header">
              <h3 className="panel-title"><Trophy size={20} /> Achievements</h3>
            </div>
            <div className="achievements-list">
              {achList.map((ach, idx) => {
                const Icon = ach.icon;
                return (
                  <div key={idx} className="achievement-item">
                    <div className="achievement-icon" style={{ backgroundColor: `${ach.color}15`, color: ach.color }}>
                      <Icon size={18} />
                    </div>
                    <span>{ach.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
