const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');
const multer = require('multer');
const pdfParseModule = require('pdf-parse');
const mammoth = require('mammoth');

const pdfParse = pdfParseModule.default || pdfParseModule;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const ROLE_TEMPLATES = [
  {
    id: 'sde',
    title: 'Software Development Engineer',
    companyLevel: 'Top Tier Product Companies',
    requiredSkills: [
      { name: 'Data Structures & Algorithms', reqLevel: 90, aliases: ['dsa', 'algorithms', 'data structures'] },
      { name: 'System Design', reqLevel: 80, aliases: ['system design', 'distributed systems'] },
      { name: 'Java', reqLevel: 75, aliases: ['java', 'c++'] },
      { name: 'React', reqLevel: 70, aliases: ['react', 'react.js'] },
      { name: 'Node.js', reqLevel: 70, aliases: ['node.js', 'node', 'express'] },
      { name: 'AWS', reqLevel: 60, aliases: ['aws', 'cloud'] }
    ],
    recommendedCourses: [
      { title: 'Grokking the System Design Interview', platform: 'Educative', type: 'Course', tags: ['System Design'] },
      { title: 'AWS Developer Associate Path', platform: 'Coursera', type: 'Certification', tags: ['Cloud'] }
    ]
  },
  {
    id: 'data',
    title: 'Data Scientist / ML Engineer',
    companyLevel: 'Data & AI Product Teams',
    requiredSkills: [
      { name: 'Python', reqLevel: 85, aliases: ['python'] },
      { name: 'Machine Learning', reqLevel: 80, aliases: ['ml', 'machine learning', 'sklearn'] },
      { name: 'SQL', reqLevel: 75, aliases: ['sql', 'postgresql', 'mysql'] },
      { name: 'Statistics', reqLevel: 70, aliases: ['statistics', 'math', 'probability'] },
      { name: 'TensorFlow / PyTorch', reqLevel: 70, aliases: ['tensorflow', 'pytorch'] }
    ],
    recommendedCourses: [
      { title: 'Deep Learning Specialization', platform: 'Coursera', type: 'Course', tags: ['ML'] },
      { title: 'Hands-on ML Projects', platform: 'Kaggle', type: 'Practice', tags: ['Projects'] }
    ]
  }
];

function normalizeSkillName(value) {
  return String(value || '').trim().toLowerCase();
}

function buildSkillMap(skills = []) {
  const map = new Map();
  skills.forEach((skill) => {
    if (!skill) return;
    const name = normalizeSkillName(typeof skill === 'string' ? skill : skill.name);
    if (!name) return;
    const level = Number.isFinite(Number(skill.level)) ? Number(skill.level) : 50;
    map.set(name, Math.max(0, Math.min(100, Math.round(level))));
  });
  return map;
}

function resolveCurrentLevel(skillMap, aliases = []) {
  let maxLevel = 0;
  aliases.forEach((alias) => {
    const key = normalizeSkillName(alias);
    if (skillMap.has(key)) {
      maxLevel = Math.max(maxLevel, skillMap.get(key));
      return;
    }

    // Also allow partial containment for commonly combined labels.
    for (const [studentSkill, level] of skillMap.entries()) {
      if (studentSkill.includes(key) || key.includes(studentSkill)) {
        maxLevel = Math.max(maxLevel, level);
      }
    }
  });
  return maxLevel;
}

function computeRoleMatch(roleTemplate, skillMap) {
  const detailedSkills = roleTemplate.requiredSkills.map((req) => {
    const currentLevel = resolveCurrentLevel(skillMap, req.aliases || [req.name]);
    return {
      name: req.name,
      reqLevel: req.reqLevel,
      currentLevel,
      category: req.name.includes('Design') || req.name.includes('Machine') ? 'Core' : 'Tools'
    };
  });

  const weighted = detailedSkills.map((s) => {
    if (s.reqLevel <= 0) return 0;
    return Math.min(100, (s.currentLevel / s.reqLevel) * 100);
  });
  const match = weighted.length > 0
    ? Math.round(weighted.reduce((a, b) => a + b, 0) / weighted.length)
    : 0;

  const sortedByGap = [...detailedSkills].sort((a, b) => (a.currentLevel - a.reqLevel) - (b.currentLevel - b.reqLevel));
  const majorGaps = sortedByGap.filter((s) => s.currentLevel < s.reqLevel).slice(0, 2).map((s) => s.name);
  const insight = majorGaps.length > 0
    ? `Largest gap areas: ${majorGaps.join(' and ')}. Prioritize these first for faster interview readiness.`
    : 'Great alignment. Focus on revision, projects, and interview practice for this role.';

  return {
    id: roleTemplate.id,
    title: roleTemplate.title,
    companyLevel: roleTemplate.companyLevel,
    match,
    requiredSkills: detailedSkills,
    recommendedCourses: roleTemplate.recommendedCourses,
    insight
  };
}

function getKeywordLibrary(targetRole) {
  const role = normalizeSkillName(targetRole);
  if (role.includes('data') || role.includes('ml') || role.includes('ai')) {
    return ['python', 'machine learning', 'sql', 'statistics', 'tensorflow', 'pytorch', 'pandas', 'numpy'];
  }
  if (role.includes('frontend')) {
    return ['react', 'javascript', 'typescript', 'html', 'css', 'redux', 'ui'];
  }
  if (role.includes('backend')) {
    return ['node.js', 'java', 'spring', 'sql', 'api', 'microservices', 'redis'];
  }
  return ['java', 'python', 'dsa', 'system design', 'sql', 'react', 'node.js', 'aws'];
}

function buildAtsReport(profile, targetRole, fileMeta = {}) {
  const skills = profile.skills || [];
  const skillNames = skills.map((s) => normalizeSkillName(typeof s === 'string' ? s : s.name));
  const keywordLibrary = getKeywordLibrary(targetRole);

  const matchedKeywords = keywordLibrary.filter((k) =>
    skillNames.some((s) => s.includes(k) || k.includes(s))
  );
  const keywordMatch = keywordLibrary.length > 0
    ? Math.round((matchedKeywords.length / keywordLibrary.length) * 100)
    : 0;

  const completenessChecks = [
    !!profile.user,
    !!profile.phone,
    !!profile.location,
    !!profile.bio,
    (profile.education || []).length > 0,
    (profile.skills || []).length >= 3,
    !!(profile.resumeFileName || fileMeta.fileName)
  ];
  const completeness = Math.round((completenessChecks.filter(Boolean).length / completenessChecks.length) * 100);

  const readability = profile.bio && profile.bio.length >= 80 ? 'High' : (profile.bio ? 'Medium' : 'Low');
  const formatting = (profile.resumeFileName || fileMeta.fileName) ? 'Pass' : 'Warning';

  let score = Math.round(0.55 * keywordMatch + 0.35 * completeness + 10);
  if (readability === 'High') score += 5;
  if (formatting !== 'Pass') score -= 8;
  score = Math.max(0, Math.min(100, score));

  const strengths = [];
  const improvements = [];

  if (keywordMatch >= 65) strengths.push('Good keyword alignment for your target role');
  else improvements.push('Increase target-role keywords in skills/projects section');

  if (readability === 'High') strengths.push('Profile summary/readability is strong and recruiter-friendly');
  else improvements.push('Add a stronger profile summary with measurable impact statements');

  if (formatting === 'Pass') strengths.push('Resume file is available and ATS-readable');
  else improvements.push('Upload a resume (PDF recommended) for ATS parsing checks');

  if ((profile.education || []).length > 0) strengths.push('Education section is present');
  else improvements.push('Add education details to improve completeness score');

  if ((profile.skills || []).length < 5) improvements.push('Add more relevant technical skills to improve match confidence');

  const status = score >= 75 ? 'Good' : score >= 55 ? 'Average' : 'Needs Work';

  return {
    score,
    status,
    readability,
    formatting,
    keywordMatch,
    strengths,
    improvements,
    parsedKeywords: matchedKeywords.map((k) => k.toUpperCase())
  };
}

function parseJsonObject(text = '') {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function normalizeAtsResult(raw, fallback) {
  if (!raw || typeof raw !== 'object') return fallback;

  const score = Math.max(0, Math.min(100, Math.round(Number(raw.score) || fallback.score || 0)));
  const keywordMatch = Math.max(0, Math.min(100, Math.round(Number(raw.keywordMatch) || fallback.keywordMatch || 0)));

  return {
    score,
    status: raw.status || fallback.status,
    readability: raw.readability || fallback.readability,
    formatting: raw.formatting || fallback.formatting,
    keywordMatch,
    strengths: Array.isArray(raw.strengths) ? raw.strengths.slice(0, 8) : fallback.strengths,
    improvements: Array.isArray(raw.improvements) ? raw.improvements.slice(0, 8) : fallback.improvements,
    parsedKeywords: Array.isArray(raw.parsedKeywords) ? raw.parsedKeywords.slice(0, 20) : fallback.parsedKeywords
  };
}

async function extractResumeText(file) {
  if (!file || !file.buffer) return '';

  const mime = (file.mimetype || '').toLowerCase();
  const name = (file.originalname || '').toLowerCase();

  if (mime.includes('pdf') || name.endsWith('.pdf')) {
    const parsed = await pdfParse(file.buffer);
    return (parsed.text || '').trim();
  }

  if (
    mime.includes('officedocument.wordprocessingml.document') ||
    name.endsWith('.docx')
  ) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return (parsed.value || '').trim();
  }

  if (mime.startsWith('text/') || name.endsWith('.txt')) {
    return file.buffer.toString('utf8').trim();
  }

  throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
}

async function runExternalAtsAnalysis({ targetRole, profile, resumeText }) {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ATS_API_KEY;
  if (!apiKey) {
    const err = new Error('ATS_API_KEY_MISSING');
    err.code = 'ATS_API_KEY_MISSING';
    throw err;
  }

  const apiUrl = process.env.ATS_API_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.ATS_MODEL || 'gpt-4o-mini';

  const profileSkills = (profile.skills || [])
    .map((s) => (typeof s === 'string' ? s : s.name))
    .filter(Boolean)
    .join(', ');

  const prompt = [
    'You are an ATS evaluator.',
    `Target role: ${targetRole}`,
    `Candidate profile skills: ${profileSkills || 'N/A'}`,
    'Evaluate this resume text and return JSON only with keys:',
    'score (0-100), status, readability, formatting, keywordMatch (0-100), strengths (array), improvements (array), parsedKeywords (array).',
    'Keep strengths/improvements concise and practical.',
    'Resume text:',
    resumeText.slice(0, 12000)
  ].join('\n');

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: 'You are a strict ATS scoring engine. Output valid JSON only.' },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    const text = await response.text();
    const err = new Error(`ATS API call failed: ${response.status}`);
    err.code = 'ATS_API_FAILED';
    err.detail = text;
    throw err;
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || '';
  const parsed = parseJsonObject(content);
  if (!parsed) {
    const err = new Error('ATS API returned non-JSON content');
    err.code = 'ATS_API_PARSE_FAILED';
    throw err;
  }

  return parsed;
}

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email', 'avatar']);
    if (!profile) return res.status(400).json({ msg: 'There is no profile for this user' });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, async (req, res) => {
  const profileFields = { ...req.body };
  profileFields.user = req.user.id;

  try {
    let profile = await Profile.findOne({ user: req.user.id });
    if (profile) {
      profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
      return res.json(profile);
    }
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/skill-gap
// @desc    Deterministic skill-gap analysis based on user profile skills
// @access  Private
router.get('/skill-gap', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);
    if (!profile) return res.status(400).json({ msg: 'There is no profile for this user' });

    const skillMap = buildSkillMap(profile.skills || []);
    const roleAnalyses = ROLE_TEMPLATES.map((template) => computeRoleMatch(template, skillMap));

    res.json({
      currentSkills: profile.skills || [],
      roles: roleAnalyses,
      generatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Skill gap analysis error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile/ats-analyze
// @desc    ATS analysis via external API integration using uploaded resume content
// @access  Private
router.post('/ats-analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    const { targetRole } = req.body || {};
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);
    if (!profile) return res.status(400).json({ msg: 'There is no profile for this user' });

    if (!req.file) {
      return res.status(400).json({ msg: 'Resume file is required for ATS analysis.' });
    }

    let resumeText;
    try {
      resumeText = await extractResumeText(req.file);
    } catch (parseErr) {
      return res.status(400).json({
        msg: parseErr.message || 'Could not parse resume file. Please upload a PDF, DOCX, or TXT file.'
      });
    }
    if (!resumeText) {
      return res.status(400).json({ msg: 'Could not extract text from resume. Try a text-based PDF/DOCX.' });
    }

    const fallback = buildAtsReport(profile, targetRole || 'Software Engineer', {
      fileName: req.file.originalname,
      fileSize: req.file.size
    });

    let apiResult;
    try {
      apiResult = await runExternalAtsAnalysis({
        targetRole: targetRole || 'Software Engineer',
        profile,
        resumeText
      });
    } catch (apiErr) {
      if (apiErr.code === 'ATS_API_KEY_MISSING') {
        return res.status(503).json({
          msg: 'ATS API key not configured. Set OPENAI_API_KEY or ATS_API_KEY in backend .env.',
          code: apiErr.code
        });
      }

      // External service failed; return deterministic analysis with diagnostic metadata.
      return res.status(200).json({
        ...fallback,
        provider: 'fallback-deterministic',
        warning: 'External ATS API failed; fallback analysis returned.',
        warningCode: apiErr.code || 'ATS_API_UNKNOWN'
      });
    }

    const normalized = normalizeAtsResult(apiResult, fallback);
    res.json({
      ...normalized,
      provider: 'external-ats-api'
    });
  } catch (err) {
    console.error('ATS analysis error:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
