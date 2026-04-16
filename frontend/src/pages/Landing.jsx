import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  BrainCircuit,
  Globe,
  Zap,
  BarChart3,
  Award,
  Briefcase,
  TrendingUp,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import './Landing.css';

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  React.useEffect(() => {
    document.body.classList.add('landing-page');
    return () => document.body.classList.remove('landing-page');
  }, []);

  return (
    <div className="landing-wrapper">
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="landing-blob blob-1"></div>
        <div className="landing-blob blob-2"></div>
        <div className="landing-blob blob-3"></div>
      </div>

      {/* Nav */}
      <nav className="landing-nav animate-fade-in">
        <div className="logo-box">
          <BrainCircuit size={32} color="var(--primary)" />
          <h2 className="logo-text gradient-text">CampusPlace</h2>
        </div>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={toggleTheme} title="Toggle Theme" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer' }}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <span className="tab-btn active">The Platform</span>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Login Portal</button>
        </div>
      </nav>

      <header className="hero-section animate-fade-in">
        <div className="hero-content animate-fade-in stagger-2">
          <div className="hero-badge">
            <Zap size={14} /> New: AI-Driven ATS Analysis Live!
          </div>
          <h1>The Next Generation <br /><span className="gradient-text">Placement Ecosystem</span></h1>
          <p>
            An all-in-one intelligence platform that automates recruitment workflows. We help students get industry-ready with AI tools,
            while providing colleges with advanced CRM-style placement management.
          </p>

          <div className="hero-cta-group">
            <div className="platform-pillars">
              <div className="pillar">
                <div className="pillar-icon"><Briefcase size={18} /></div>
                <span><strong>Job Portal:</strong> 50+ Active hiring drives.</span>
              </div>
              <div className="pillar">
                <div className="pillar-icon"><Zap size={18} /></div>
                <span><strong>AI Powered:</strong> Skills and Resume analysis.</span>
              </div>
              <div className="pillar">
                <div className="pillar-icon"><Globe size={18} /></div>
                <span><strong>CDC Command:</strong> Centralized data hub.</span>
              </div>
            </div>
            <button className="btn btn-primary hero-btn mt-6" onClick={() => navigate('/login')}>
              Enter The Portal <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="hero-visual animate-fade-in stagger-3">
          <div className="visual-card glass-panel">
            <div className="card-header">
              <BarChart3 size={20} color="var(--primary)" />
              <span>Real-time Analytics</span>
            </div>
            <div className="card-placeholder-bars">
              <div className="ph-bar" style={{ width: '60%' }}></div>
              <div className="ph-bar" style={{ width: '85%' }}></div>
              <div className="ph-bar" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div className="visual-card glass-panel floating">
            <div className="card-header">
              <Award size={20} color="var(--success)" />
              <span>Placement Ready</span>
            </div>
            <div className="ph-circle">92%</div>
          </div>
        </div>
      </header>

      {/* Features Grid */}
      <section className="features-section mt-12">
        <div className="features-grid">
          <div className="feature-card glass-panel animate-fade-in stagger-4">
            <div className="feature-icon" style={{ backgroundColor: 'rgba(129, 140, 248, 0.1)', color: 'var(--primary)' }}>
              <ShieldCheck size={24} />
            </div>
            <h3>AI ATS Optimizer</h3>
            <p>Ensure your resume passes through corporate filters with keyword analysis and layout checks.</p>
          </div>
          <div className="feature-card glass-panel animate-fade-in stagger-4">
            <div className="feature-icon" style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)' }}>
              <Globe size={24} />
            </div>
            <h3>Job Hub</h3>
            <p>Centralized gateway for all on-campus opportunities from top-tier tech giants to agile startups.</p>
          </div>
          <div className="feature-card glass-panel animate-fade-in stagger-4">
            <div className="feature-icon" style={{ backgroundColor: 'rgba(192, 132, 252, 0.1)', color: 'var(--secondary)' }}>
              <TrendingUp size={24} />
            </div>
            <h3>Skill Gap Map</h3>
            <p>Visual path from your current skills to industry standards with personalized course suggestions.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; 2026 CampusPlace AI Ecosystem. Built for industry-ready careers.</p>
      </footer>
    </div>
  );
}
