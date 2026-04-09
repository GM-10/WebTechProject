import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  Building2, 
  ChevronRight,
  BrainCircuit,
  Globe,
  Zap,
  BarChart3,
  Award,
  Briefcase,
  TrendingUp
} from 'lucide-react';
import api from '../utils/api';
import './Landing.css';

export default function Landing() {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [isLogin, setIsLogin] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    role: 'student',
    name: ''
  });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const res = await api.post(endpoint, formData);
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('user', JSON.stringify(res.data.user));

      setLoading(false);
      navigate(res.data.user.role === 'cdc' ? '/app/analytics' : '/app/dashboard');
    } catch (err) {
      console.error('Auth error:', err);
      alert(err.response?.data?.msg || 'Authentication failed');
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    const demoEmail = role === 'student' ? 'student@demo.com' : 'cdc@demo.com';
    try {
      const res = await api.post('/auth/login', {
        email: demoEmail,
        password: 'pass123'
      });

      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('user', JSON.stringify(res.data.user));
      navigate(res.data.user.role === 'cdc' ? '/app/analytics' : '/app/dashboard');
    } catch (err) {
      console.error('Demo login error:', err);
      alert(err.response?.data?.msg || 'Demo login failed. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

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
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>The Platform</button>
          <button className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Login Portal</button>
          <button className="btn btn-primary" onClick={() => setActiveTab('login')}>Get Started</button>
        </div>
      </nav>

      {/* Main Content Toggle */}
      {activeTab === 'overview' ? (
        <header className="hero-section">
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
                   <span><strong>AI Powered:</strong> Skills & Resume analysis.</span>
                </div>
                <div className="pillar">
                   <div className="pillar-icon"><Globe size={18} /></div>
                   <span><strong>CDC Command:</strong> Centralized data hub.</span>
                </div>
              </div>
              <button className="btn btn-primary hero-btn mt-6" onClick={() => setActiveTab('login')}>
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
                <div className="ph-bar" style={{width: '60%'}}></div>
                <div className="ph-bar" style={{width: '85%'}}></div>
                <div className="ph-bar" style={{width: '45%'}}></div>
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
      ) : (
        <section className="login-portal-section animate-fade-in">
           <div className="portal-container glass-panel">
              <div className="portal-header">
                <div className="tab-switcher">
                  <button className={`auth-pill ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
                  <button className={`auth-pill ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Sign Up</button>
                </div>
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p>{isLogin ? 'Access your placement dashboard' : 'Join the campus ecosystem'}</p>
              </div>

              <form className="auth-form" onSubmit={handleAuth}>
                {!isLogin && (
                  <div className="input-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="Alex Chen" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                )}
                <div className="input-group">
                   <label>Email ID</label>
                   <input type="email" placeholder="alex@university.edu" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="input-group">
                   <label>Password</label>
                   <input type="password" placeholder="••••••••" required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                {!isLogin && (
                   <div className="input-group">
                      <label>User Role</label>
                      <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                         <option value="student">Student</option>
                         <option value="cdc">CDC Administrator</option>
                      </select>
                   </div>
                )}
                <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                  {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Sign Up')}
                </button>
              </form>

              <div className="demo-login-options">
                 <span>Testing shortcuts:</span>
                 <div className="demo-grid">
                    <button className="demo-btn student-demo" onClick={() => handleDemoLogin('student')}>Student Login</button>
                    <button className="demo-btn cdc-demo" onClick={() => handleDemoLogin('cdc')}>CDC/Admin Login</button>
                 </div>
              </div>
           </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="features-section mt-12">
        <div className="features-grid">
          <div className="feature-card glass-panel animate-fade-in stagger-4">
            <div className="feature-icon" style={{backgroundColor: 'rgba(129, 140, 248, 0.1)', color: 'var(--primary)'}}>
              <ShieldCheck size={24} />
            </div>
            <h3>AI ATS Optimizer</h3>
            <p>Ensure your resume passes through corporate filters with keyword analysis and layout checks.</p>
          </div>
          <div className="feature-card glass-panel animate-fade-in stagger-4">
            <div className="feature-icon" style={{backgroundColor: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent)'}}>
              <Globe size={24} />
            </div>
            <h3>Job Hub</h3>
            <p>Centralized gateway for all on-campus opportunities from top-tier tech giants to agile startups.</p>
          </div>
          <div className="feature-card glass-panel animate-fade-in stagger-4">
            <div className="feature-icon" style={{backgroundColor: 'rgba(192, 132, 252, 0.1)', color: 'var(--secondary)'}}>
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
