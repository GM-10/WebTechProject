import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  ArrowRight, 
  ShieldCheck, 
  UserPlus, 
  LogIn 
} from 'lucide-react';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    
    try {
      const res = await api.post(endpoint, formData);
      sessionStorage.setItem('token', res.data.token);
      sessionStorage.setItem('user', JSON.stringify(res.data.user));

      setLoading(false);
      navigate(res.data.user.role === 'cdc' ? '/app/analytics' : '/app/dashboard');
      window.location.reload(); // Refresh to catch storage changes
    } catch (err) {
      console.error('Auth error:', err);
      alert(err.response?.data?.msg || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-background">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
      </div>
      
      <div className="auth-container glass-panel animate-fade-in">
        <div className="auth-header">
          <div className="demo-pills">
            <button className="demo-pill student" onClick={() => {
              setFormData({...formData, email: 'student@demo.com', password: 'pass123'});
              setIsLogin(true);
            }}>
              Demo Student
            </button>
            <button className="demo-pill cdc" onClick={() => {
              setFormData({...formData, email: 'cdc@demo.com', password: 'pass123'});
              setIsLogin(true);
            }}>
              Demo CDC
            </button>
          </div>
          <div className="auth-logo mt-4">
            <ShieldCheck size={32} color="var(--primary)" />
          </div>
          <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p>{isLogin ? 'Login to access your placement dashboard' : 'Join the campus placement ecosystem'}</p>
        </div>


        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="auth-input-group">
              <label><User size={16} /> Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="auth-input-group">
            <label><Mail size={16} /> Email Address</label>
            <input 
              type="email" 
              placeholder="john@university.edu"
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="auth-input-group">
            <label><Lock size={16} /> Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {!isLogin && (
            <div className="auth-input-group">
              <label><Briefcase size={16} /> I am a...</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
              >
                <option value="student">Student</option>
                <option value="cdc">CDC Administrator</option>
              </select>
            </div>
          )}

          <button className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Authenticating...' : (isLogin ? <><LogIn size={18} /> Login</> : <><UserPlus size={18} /> Register</>)}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button className="auth-toggle" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Create one now' : 'Login instead'} <ArrowRight size={14} />
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
