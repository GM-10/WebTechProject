import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, BarChart, FileSearch, ShieldCheck, Target } from 'lucide-react';
import './AtsChecker.css';

export default function AtsChecker() {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const analyzeResume = () => {
    if (!file) return;
    setIsAnalyzing(true);
    
    // Simulate API call for ATS analysis
    setTimeout(() => {
      setResult({
        score: 78,
        status: 'Good',
        readability: 'High',
        formatting: 'Pass',
        keywordMatch: 65,
        strengths: [
          'Strong action verbs used in experience section',
          'Education timeline is clearly formatted',
          'Contact information is complete and parsable'
        ],
        improvements: [
          'Add quantitative metrics to your recent projects',
          'Missing key industry buzzwords for "Software Engineer"',
          'Include a dedicated certifications section'
        ],
        parsedKeywords: ['JavaScript', 'React', 'Node.js', 'Java', 'SQL', 'Git', 'Agile']
      });
      setIsAnalyzing(false);
    }, 2500);
  };

  const resetAnalyzer = () => {
    setFile(null);
    setResult(null);
  };

  return (
    <div className="ats-container animate-fade-in stagger-1">
      <div className="ats-header">
        <div>
          <h1 className="ats-heading">AI ATS <span className="gradient-text">Resume Checker</span></h1>
          <p className="ats-subheading">Test if your resume can pass corporate Applicant Tracking Systems</p>
        </div>
      </div>

      <div className="ats-grid">
        {/* Left Col - Upload & Configuration */}
        <div className="ats-col-main">
          {!result && !isAnalyzing && (
            <div className="panel glass-panel upload-panel animate-fade-in stagger-2">
              <div className="upload-config">
                <label>Target Role for Keyword Analysis</label>
                <input 
                  type="text" 
                  className="role-input" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Data Scientist, Frontend Developer..."
                />
              </div>

              <div 
                className="resume-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="selected-file">
                    <FileText size={48} color="var(--primary)" />
                    <h4>{file.name}</h4>
                    <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <button className="btn btn-primary mt-4 w-full" onClick={analyzeResume}>
                      <FileSearch size={16} /> Analyze Resume
                    </button>
                    <button className="btn btn-ghost w-full" onClick={() => setFile(null)}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <div className="upload-icon-pulse">
                      <Upload size={32} color="var(--primary)" />
                    </div>
                    <h3>Upload Resume</h3>
                    <p>Drag and drop your PDF or DOCX file here</p>
                    <div className="upload-divider"><span>OR</span></div>
                    <label className="btn btn-primary">
                      <FileText size={16} /> Browse Files
                      <input type="file" accept=".pdf,.doc,.docx" hidden onChange={handleFileUpload} />
                    </label>
                  </>
                )}
              </div>
            </div>
          )}

          {isAnalyzing && (
            <div className="panel glass-panel analyzing-panel animate-fade-in">
              <RefreshCw size={48} className="spinner" color="var(--primary)" />
              <h3>Analyzing your resume...</h3>
              <p>Extracting text, checking formatting, and matching keywords for <strong>{targetRole}</strong></p>
              
              <div className="scanning-steps">
                <div className="scan-step active"><CheckCircle size={14} /> Parsing document structure</div>
                <div className="scan-step waiting"><CheckCircle size={14} /> Evaluating readability</div>
                <div className="scan-step waiting"><CheckCircle size={14} /> Keyword matching</div>
              </div>
            </div>
          )}

          {result && (
            <div className="ats-result-view animate-fade-in">
              {/* Score Header */}
              <div className="score-hero glass-panel">
                <div className="score-hero-left">
                  <h2>ATS Score</h2>
                  <div className="score-meta">Target: <strong>{targetRole}</strong></div>
                  <div className="score-meta">File: <strong>{file?.name}</strong></div>
                  <button className="btn btn-ghost border-btn mt-4" onClick={resetAnalyzer}>
                    <Upload size={14} /> Scan Another
                  </button>
                </div>
                
                <div className="score-circle-wrapper">
                  <svg viewBox="0 0 36 36" className="score-circular-chart">
                    <path className="score-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="score-fill" 
                      strokeDasharray={`${result.score}, 100`} 
                      style={{stroke: result.score > 75 ? 'var(--success)' : 'var(--warning)'}}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                    />
                    <text x="18" y="20.35" className="score-value">{result.score}</text>
                  </svg>
                  <span className="score-status" style={{color: result.score > 75 ? 'var(--success)' : 'var(--warning)'}}>{result.status}</span>
                </div>
              </div>

              {/* Feedback Checks */}
              <div className="feedback-section glass-panel mt-6">
                <h3><AlertCircle size={18} /> Critical Fixes</h3>
                <div className="feedback-list">
                  {result.improvements.map((imp, idx) => (
                    <div key={idx} className="feedback-item error-item">
                      <div className="fb-icon"><AlertCircle size={14} /></div>
                      <p>{imp}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="feedback-section glass-panel mt-6">
                <h3><CheckCircle size={18} /> What you did well</h3>
                <div className="feedback-list">
                  {result.strengths.map((str, idx) => (
                    <div key={idx} className="feedback-item success-item">
                      <div className="fb-icon"><CheckCircle size={14} /></div>
                      <p>{str}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Col - Meta Stats */}
        <div className="ats-col-side">
          {result ? (
            <>
              <div className="panel glass-panel animate-fade-in stagger-2">
                <h3 className="panel-title mb-4"><ShieldCheck size={18} /> ATS Parsing Checks</h3>
                <div className="parse-checks">
                  <div className="parse-row">
                    <span>Contact Info Parsed</span>
                    <span className="p-success"><CheckCircle size={14}/> Pass</span>
                  </div>
                  <div className="parse-row">
                    <span>File Format</span>
                    <span className="p-success"><CheckCircle size={14}/> PDF (Good)</span>
                  </div>
                  <div className="parse-row">
                    <span>Font Readability</span>
                    <span className="p-success"><CheckCircle size={14}/> {result.readability}</span>
                  </div>
                  <div className="parse-row">
                    <span>Complex Tables/Columns</span>
                    <span className="p-success"><CheckCircle size={14}/> None found</span>
                  </div>
                </div>
              </div>

              <div className="panel glass-panel animate-fade-in stagger-3">
                <h3 className="panel-title mb-4"><Target size={18} /> Keyword Analysis</h3>
                <div className="keyword-match-stat">
                  <span className="km-value">{result.keywordMatch}%</span>
                  <span className="km-label">Match with typical "{targetRole}" requirements</span>
                </div>
                <div className="progress-track mt-2 mb-4">
                  <div className="progress-fill" style={{width: `${result.keywordMatch}%`, background: 'var(--warning)'}}></div>
                </div>
                
                <h4 className="text-sm text-muted mt-4 mb-2 uppercase tracking-wide">Extracted Keywords</h4>
                <div className="keyword-tags">
                  {result.parsedKeywords.map(kw => (
                    <span key={kw} className="keyword-tag">{kw}</span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="panel glass-panel ats-info-panel animate-fade-in stagger-3">
              <div className="icon-circle mb-4"><BarChart size={24} color="var(--primary)" /></div>
              <h3>Why check your resume?</h3>
              <p>Over 75% of resumes are rejected by Applicant Tracking Systems before a human ever sees them. Our AI scanner checks:</p>
              <ul>
                <li><strong>Readability:</strong> Can bots extract your text?</li>
                <li><strong>Formatting:</strong> Are tables or columns breaking parsers?</li>
                <li><strong>Keywords:</strong> Do you have the skills companies search for?</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
