import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Users, 
  Building2, 
  TrendingUp, 
  PieChart, 
  BarChart, 
  Briefcase, 
  Download,
  Filter,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react';
import api from '../utils/api';
import './Analytics.css';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trends, setTrends] = useState(null);
  const [stats, setStats] = useState([]);
  const [distribution, setDistribution] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/summary');
        const { trends: tData, stats: sData, sectors: dData } = res.data;
        
        if (tData) setTrends(tData);
        if (sData) setStats(sData);
        if (dData) setDistribution(dData);
        setData(res.data);

        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError('Failed to load placement analytics. Please ensure you have CDC permissions.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '80vh' }}>
        <div className="loader-container">
          <Loader2 className="animate-spin" size={48} color="var(--primary)" />
          <p className="mt-4">Aggregating intelligence...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center" style={{ height: '80vh' }}>
        <div className="panel glass-panel text-center p-8">
          <AlertCircle size={48} color="var(--error)" className="mb-4" />
          <h3>{error}</h3>
          <button className="btn btn-primary mt-4" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Icons for stats cards
  const iconMap = {
    'Total Students': Users,
    'Placed Students': Briefcase,
    'Total Offers': TrendingUp,
    'Active Companies': Building2
  };

  const getTrendPath = () => {
    if (!data?.trends?.counts || data.trends.counts.length === 0) return "";
    const counts = data.trends.counts;
    const max = Math.max(...counts, 1);
    const points = counts.map((count, i) => {
      const x = (i / (counts.length - 1)) * 400;
      const y = 140 - (count / max) * 120;
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const getTrendAreaPath = () => {
    const path = getTrendPath();
    if (!path) return "";
    return `${path} L 400,150 L 0,150 Z`;
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/analytics/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'placement_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export report. Access denied.');
    }
  };

  return (
    <div className="analytics-container animate-fade-in">
      <div className="analytics-header">
        <div>
          <h1 className="analytics-heading">Placement <span className="gradient-text">Analytics</span></h1>
          <p className="analytics-subheading">Centralized intelligence dashboard for Career Development Cell</p>
        </div>
        <div className="analytics-actions">
          <button className="btn btn-ghost border-btn">
            <Filter size={16} /> Filter Date
          </button>
          <button className="btn btn-primary" onClick={handleExport}>
            <Download size={16} /> Export Reports
          </button>
        </div>
      </div>


      <div className="stats-grid">
        {(data?.stats || []).map((stat, idx) => {
          const Icon = iconMap[stat.label] || BarChart;
          return (
            <div key={idx} className="panel glass-panel stat-card">
              <div className="stat-card-header">
                <div className="stat-icon-box" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                  <Icon size={22} />
                </div>
                <span className={`stat-change ${stat.change.startsWith('+') ? 'positive' : 'negative'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="stat-card-body">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="analytics-main-grid mt-6">
        {/* Placement Progress Chart */}
        <div className="panel glass-panel animate-fade-in stagger-1">
          <div className="panel-header mb-6">
            <h3 className="panel-title"><LineChart size={18} /> Placement Trends (Monthly)</h3>
            <div className="panel-period-toggle">
              <span className="active">Current</span>
              <span>Overall</span>
            </div>
          </div>
          <div className="chart-placeholder large">
            <svg viewBox="0 0 400 150" className="trend-line-chart">
              <path 
                d={getTrendPath()} 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="3" 
                className="trend-line-path"
              />
              <path 
                d={getTrendAreaPath()} 
                fill="url(#trendGradient)" 
                className="trend-area-path"
              />
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
            <div className="chart-labels-x">
              {(data?.trends?.labels || []).map((label, i) => (
                <span key={i}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Sector Distribution */}
        <div className="panel glass-panel animate-fade-in stagger-2">
          <div className="panel-header mb-6">
            <h3 className="panel-title"><PieChart size={18} /> Sector Distribution</h3>
          </div>
          <div className="pie-chart-section">
            <div className="pie-placeholder">
              <div className="pie-ring"></div>
              <div className="pie-center">
                <span className="pc-val">100%</span>
                <span className="pc-lbl">Total</span>
              </div>
            </div>
            <div className="pie-legend">
              {(data?.sectors || []).map(cat => (
                <div key={cat.sector} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: cat.color }}></span>
                  <span className="legend-name">{cat.sector}</span>
                  <span className="legend-val">{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="analytics-secondary-grid mt-6">
        {/* Recent Company Visits */}
        <div className="panel glass-panel animate-fade-in stagger-3">
          <div className="panel-header mb-4">
            <h3 className="panel-title"><Calendar size={18} /> Recruitment Activity</h3>
          </div>
          <div className="admin-list">
            {(data?.recentDrives || []).map((visit, i) => (
              <div key={i} className="admin-list-item">
                <div className="ali-info">
                  <h4>{visit.company}</h4>
                  <span>{visit.applicants} students applied</span>
                </div>
                <div className="ali-meta">
                  <span className="ali-date">{visit.date}</span>
                  <span className={`ali-badge ${visit.status.toLowerCase()}`}>{visit.status}</span>
                </div>
              </div>
            ))}
            {data?.recentDrives?.length === 0 && (
              <p className="text-secondary p-4 text-center">No recent recruitment drives recorded.</p>
            )}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="panel glass-panel gradient-border-panel animate-fade-in stagger-4">
          <div className="panel-header mb-4">
            <h3 className="panel-title"><AlertCircle size={18} color="var(--error)" /> Critical Actions</h3>
          </div>
          <div className="admin-alerts">
            <div className="admin-alert error">
              <p>Verify outstanding student profiles for tomorrow's recruitment drive.</p>
              <button className="btn-text">Review Now</button>
            </div>
            <div className="admin-alert warning">
              <p>Upcoming job posting deadline for Amazon approaching in 24 hours.</p>
              <button className="btn-text">Notify Students</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

