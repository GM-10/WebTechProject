import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  ChevronDown,
  X,
  Star,
  Users,
  Calendar,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  Zap,
  ArrowUpDown,
  CheckCircle2,
  Plus,
  Pencil
} from 'lucide-react';
import './Jobs.css';

const mockJobs = [
  {
    id: 1,
    role: 'Software Engineer',
    company: 'Google',
    logo: 'G',
    logoColor: '#4285f4',
    location: 'Bangalore, India',
    type: 'Full Time',
    ctc: '₹25-35 LPA',
    deadline: 'Apr 15, 2026',
    postedAgo: '2 days ago',
    tags: ['Java', 'React', 'Cloud', 'DSA'],
    match: 92,
    applicants: 156,
    description: 'Join our engineering team to build products that impact billions of users worldwide. Work on large-scale distributed systems.',
    eligibility: 'CGPA ≥ 8.0 | No active backlogs',
    rounds: ['Online Assessment', 'Technical Interview (2)', 'HR Interview'],
    status: 'open',
  },
  {
    id: 2,
    role: 'SDE-1',
    company: 'Amazon',
    logo: 'A',
    logoColor: '#ff9900',
    location: 'Hyderabad, India',
    type: 'Full Time',
    ctc: '₹20-30 LPA',
    deadline: 'Apr 20, 2026',
    postedAgo: '5 days ago',
    tags: ['AWS', 'Node.js', 'System Design', 'DSA'],
    match: 88,
    applicants: 210,
    description: 'Build and maintain scalable backend services powering Amazon\'s e-commerce platform.',
    eligibility: 'CGPA ≥ 7.5 | CS/IT branch',
    rounds: ['Online Assessment', 'Technical Interview (3)', 'Bar Raiser'],
    status: 'open',
  },
  {
    id: 3,
    role: 'Frontend Developer Intern',
    company: 'Microsoft',
    logo: 'M',
    logoColor: '#00a4ef',
    location: 'Noida, India',
    type: 'Internship',
    ctc: '₹80K/month',
    deadline: 'Apr 10, 2026',
    postedAgo: '1 week ago',
    tags: ['React', 'TypeScript', 'CSS', 'Azure'],
    match: 95,
    applicants: 89,
    description: 'Work on the next generation of Microsoft 365 applications with cutting-edge frontend technologies.',
    eligibility: 'CGPA ≥ 7.0 | Pre-final year',
    rounds: ['Online Assessment', 'Technical Interview', 'HR Interview'],
    status: 'open',
  },
  {
    id: 4,
    role: 'Data Engineer',
    company: 'Flipkart',
    logo: 'F',
    logoColor: '#2874f0',
    location: 'Bangalore, India',
    type: 'Full Time',
    ctc: '₹18-25 LPA',
    deadline: 'Apr 25, 2026',
    postedAgo: '3 days ago',
    tags: ['Python', 'Spark', 'SQL', 'Kafka'],
    match: 72,
    applicants: 134,
    description: 'Design data pipelines and architecture powering Flipkart\'s data-driven decisions.',
    eligibility: 'CGPA ≥ 7.0 | Any branch',
    rounds: ['Online Assessment', 'Technical Interview (2)', 'Hiring Manager'],
    status: 'open',
  },
  {
    id: 5,
    role: 'Product Engineer',
    company: 'Razorpay',
    logo: 'R',
    logoColor: '#3395ff',
    location: 'Bangalore, India',
    type: 'Full Time',
    ctc: '₹22-28 LPA',
    deadline: 'May 01, 2026',
    postedAgo: '1 day ago',
    tags: ['Go', 'React', 'Microservices', 'Payments'],
    match: 80,
    applicants: 78,
    description: 'Build the future of payments infrastructure for millions of businesses across India.',
    eligibility: 'CGPA ≥ 7.5 | CS/IT/ECE branch',
    rounds: ['Coding Round', 'System Design', 'Cultural Fit'],
    status: 'open',
  },
  {
    id: 6,
    role: 'ML Engineer Intern',
    company: 'Adobe',
    logo: 'Ad',
    logoColor: '#ff0000',
    location: 'Noida, India',
    type: 'Internship',
    ctc: '₹60K/month',
    deadline: 'Apr 18, 2026',
    postedAgo: '4 days ago',
    tags: ['Python', 'TensorFlow', 'NLP', 'Computer Vision'],
    match: 65,
    applicants: 192,
    description: 'Research and develop ML models powering Adobe Creative Cloud\'s intelligent features.',
    eligibility: 'CGPA ≥ 8.0 | ML coursework required',
    rounds: ['Resume Shortlist', 'ML Coding Round', 'Research Discussion'],
    status: 'open',
  },
];

const filterOptions = {
  type: ['Full Time', 'Internship', 'Part Time'],
  location: ['Bangalore', 'Hyderabad', 'Noida', 'Mumbai', 'Remote'],
  sortBy: ['Match Score', 'Deadline', 'CTC', 'Recently Posted'],
};

export default function Jobs() {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user') || '{}') || {};
  const isCDC = user.role === 'cdc' || user.role === 'admin';

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState('All');
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [expandedJob, setExpandedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [showApplyModal, setShowApplyModal] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        const normalizedJobs = (res.data || []).map((job) => ({
          ...job,
          tags: Array.isArray(job.tags) ? job.tags : [],
          rounds: Array.isArray(job.rounds) ? job.rounds : [],
          applicants: job.applicants ?? job.applicantsCount ?? 0,
          match: typeof job.match === 'number' ? job.match : 75,
          logo: job.logo || (job.company ? job.company.charAt(0).toUpperCase() : 'C'),
          logoColor: job.logoColor || '#818cf8',
          postedAgo: job.postedAgo || 'Recently posted'
        }));
        setJobs(normalizedJobs);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const toggleSave = (id) => {
    setSavedJobs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleApply = async (id) => {
    try {
      await api.post('/applications', { jobId: id });
      setAppliedJobs(prev => new Set([...prev, id]));
      setShowApplyModal(null);
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying:', err);
      alert('Failed to submit application.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (job.tags && job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesType = selectedType === 'All' || job.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="jobs-container animate-fade-in stagger-1">
        <div className="coming-soon-page">
          <h2>Loading Jobs...</h2>
          <p>Finding the best opportunities for you.</p>
        </div>
      </div>
    );
  }

  const getMatchColor = (match) => {
    if (match >= 90) return 'var(--success)';
    if (match >= 75) return 'var(--primary)';
    if (match >= 60) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div className="jobs-container animate-fade-in stagger-1">
      {/* Page Header */}
      <div className="jobs-page-header">
        <div>
          <h1 className="jobs-heading">{isCDC ? 'Manage ' : 'On-Campus '} <span className="gradient-text">{isCDC ? 'Job Drives' : 'Opportunities'}</span></h1>
          <p className="jobs-subheading">{filteredJobs.length} active openings across {new Set(jobs.map(j => j.company)).size} companies</p>
        </div>
        <div className="jobs-header-stats">
          <div className="jh-stat glass-panel">
            <Zap size={18} color="var(--warning)" />
            <div>
              <span className="jh-stat-value">{jobs.filter(j => new Date(j.postedDate || j.createdAt).toDateString() === new Date().toDateString()).length || 1}</span>
              <span className="jh-stat-label">New Today</span>
            </div>
          </div>
          <div className="jh-stat glass-panel">
            <Clock size={18} color="var(--error)" />
            <div>
              <span className="jh-stat-value">{jobs.filter(j => new Date(j.deadline) < new Date(Date.now() + 3*24*60*60*1000)).length}</span>
              <span className="jh-stat-label">Closing Soon</span>
            </div>
          </div>
          {isCDC && (
             <button className="btn btn-primary ml-4" onClick={() => {/* Handle Create Job */}}>
               <Plus size={18} /> Add New Drive
             </button>
          )}
        </div>

      </div>

      {/* Search & Filter Bar */}
      <div className="jobs-toolbar glass-panel">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search roles, companies, or skills..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filter-tabs">
          {['All', 'Full Time', 'Internship'].map(type => (
            <button
              key={type}
              className={`filter-tab ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <button
          className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} /> Filters
          <ChevronDown size={14} className={`filter-chevron ${showFilters ? 'open' : ''}`} />
        </button>
      </div>

      {/* Expandable Filters */}
      {showFilters && (
        <div className="filters-expanded glass-panel animate-fade-in">
          <div className="filter-group">
            <label>Location</label>
            <div className="filter-chips">
              {filterOptions.location.map(loc => (
                <button key={loc} className="filter-chip">{loc}</button>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <label>Sort By</label>
            <div className="filter-chips">
              {filterOptions.sortBy.map(s => (
                <button key={s} className="filter-chip">
                  <ArrowUpDown size={12} /> {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="jobs-list">
        {filteredJobs.map((job, idx) => (
          <div
            key={job._id}
            className={`job-listing-card glass-panel animate-fade-in stagger-${Math.min(idx + 2, 4)} ${expandedJob === job._id ? 'expanded' : ''}`}
          >
            <div className="job-listing-main" onClick={() => setExpandedJob(expandedJob === job._id ? null : job._id)}>

              <div className="job-listing-left">
                <div className="company-logo" style={{ backgroundColor: `${job.logoColor}20`, color: job.logoColor }}>
                  {job.logo}
                </div>
                <div className="job-listing-info">
                  <div className="job-listing-title-row">
                    <h3 className="job-listing-title">{job.role}</h3>
                    {appliedJobs.has(job._id) && (
                      <span className="applied-badge"><CheckCircle2 size={14} /> Applied</span>
                    )}

                  </div>
                  <div className="job-listing-meta">
                    <span><Building2 size={14} /> {job.company}</span>
                    <span><MapPin size={14} /> {job.location}</span>
                    <span><DollarSign size={14} /> {job.ctc}</span>
                    <span className={`job-type-badge ${job.type === 'Internship' ? 'internship' : 'fulltime'}`}>
                      {job.type}
                    </span>
                  </div>
                  <div className="job-listing-tags">
                    {job.tags.map(t => (
                      <span key={t} className="job-tag">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="job-listing-right">
                {!isCDC ? (
                   <div className="match-ring" style={{ '--match-color': getMatchColor(job.match) }}>
                   <svg viewBox="0 0 36 36" className="match-svg">
                     <path className="match-bg-path"
                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                     />
                     <path className="match-fill-path"
                       strokeDasharray={`${job.match}, 100`}
                       d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                       style={{ stroke: getMatchColor(job.match) }}
                     />
                     <text x="18" y="20.35" className="match-text">{job.match}%</text>
                   </svg>
                   <span className="match-label">Match</span>
                 </div>
                ) : (
                  <div className="applicants-summary">
                    <span className="applicants-count">{job.applicants || 0}</span>
                    <span className="match-label">Applicants</span>
                  </div>
                )}

                {!isCDC && (
                  <div className="job-listing-actions">
                    <button
                      className={`save-btn ${savedJobs.has(job.id) ? 'saved' : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleSave(job._id); }}
                      title={savedJobs.has(job._id) ? 'Unsave' : 'Save'}

                    >
                      {savedJobs.has(job.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedJob === job._id && (
              <div className="job-expanded-details animate-fade-in">
                <div className="job-detail-grid">
                  <div className="job-detail-section">
                    <h4>Description</h4>
                    <p>{job.description}</p>
                  </div>
                  <div className="job-detail-section">
                    <h4>Eligibility</h4>
                    <p>{job.eligibility}</p>
                  </div>
                  <div className="job-detail-section">
                    <h4>Selection Process</h4>
                    <div className="rounds-flow">
                      {job.rounds.map((round, rIdx) => (
                        <React.Fragment key={rIdx}>
                          <span className="round-step">{round}</span>
                          {rIdx < job.rounds.length - 1 && <span className="round-arrow">→</span>}
                        </React.Fragment>
                      ))}
                      {job.rounds.length === 0 && <span className="round-step">Process details will be shared by CDC</span>}
                    </div>
                  </div>
                  <div className="job-detail-section">
                    <h4>Details</h4>
                    <div className="detail-meta-row">
                      <span><Users size={14} /> {job.applicants || 0} applicants</span>
                      <span><Calendar size={14} /> Deadline: {job.deadline}</span>
                      <span><Clock size={14} /> Posted {job.postedAgo}</span>
                    </div>
                  </div>
                </div>
                <div className="job-expanded-actions">
                  {isCDC ? (
                    <>
                      <button className="btn btn-primary" onClick={() => navigate('/app/applications')}>
                        <Users size={16} /> View Applicants
                      </button>
                      <button className="btn btn-ghost border-btn">
                        <Pencil size={16} /> Edit Drive
                      </button>
                    </>
                  ) : (
                    appliedJobs.has(job._id) ? (
                      <button className="btn btn-ghost border-btn" disabled>
                        <CheckCircle2 size={16} /> Already Applied
                      </button>
                    ) : (
                      <button className="btn btn-primary" onClick={() => setShowApplyModal(job)}>
                        <Briefcase size={16} /> Apply Now
                      </button>
                    )
                  )}
                  {!isCDC && (
                    <button className="btn btn-ghost border-btn">
                      <ExternalLink size={16} /> Company Page
                    </button>
                  ) }
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="no-results glass-panel">
          <Search size={48} color="var(--text-muted)" />
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(null)}>
          <div className="apply-modal glass-panel animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for <span className="gradient-text">{showApplyModal.role}</span></h2>
              <button className="modal-close" onClick={() => setShowApplyModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-company-info">
                <div className="company-logo" style={{ backgroundColor: `${showApplyModal.logoColor}20`, color: showApplyModal.logoColor }}>
                  {showApplyModal.logo}
                </div>
                <div>
                  <h3>{showApplyModal.company}</h3>
                  <p>{showApplyModal.location} · {showApplyModal.type}</p>
                </div>
              </div>
              <div className="modal-checklist">
                <h4>Pre-Application Checklist</h4>
                <div className="checklist-item checked">
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span>Profile information complete</span>
                </div>
                <div className="checklist-item checked">
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span>Resume uploaded</span>
                </div>
                <div className="checklist-item checked">
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span>Meets CGPA requirement</span>
                </div>
                <div className="checklist-item checked">
                  <CheckCircle2 size={18} color="var(--success)" />
                  <span>Required skills match: {showApplyModal.match}%</span>
                </div>
              </div>
              <p className="modal-note">By applying, your profile and resume will be shared with {showApplyModal.company}'s recruitment team.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost border-btn" onClick={() => setShowApplyModal(null)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => handleApply(showApplyModal._id)}>

                <Briefcase size={16} /> Confirm Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
