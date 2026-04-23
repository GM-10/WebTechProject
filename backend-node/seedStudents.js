/**
 * seedStudents.js
 * Seeds 30 realistic student accounts with full profiles for demo purposes.
 * 
 * Standalone: node seedStudents.js
 * In-process:  const { autoSeed } = require('./seedStudents'); await autoSeed();
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Profile = require('./models/Profile');
const CDCStudentProfile = require('./models/CDCStudentProfile');
const Application = require('./models/Application');
const Job = require('./models/Job');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/placement_ecosystem';

// ─── STUDENT RAW DATA ────────────────────────────────────────────────────────
const studentData = [
  { name: 'Arjun Sharma',    branch: 'CSE',        cgpa: 9.1, activeBacklogs: 0, totalBacklogs: 0, ats: 88, platform: 'LeetCode',   rating: 1850, solved: 420, placed: 'Google',        ctc: '₹32 LPA',   status: 'Placed',     skills: ['C++','Python','DSA','System Design','React'] },
  { name: 'Priya Mehta',     branch: 'ICT',        cgpa: 8.7, activeBacklogs: 0, totalBacklogs: 0, ats: 82, platform: 'CodeChef',   rating: 1720, solved: 310, placed: 'Microsoft',     ctc: '₹28 LPA',   status: 'Placed',     skills: ['Java','Spring Boot','SQL','REST APIs','AWS'] },
  { name: 'Rahul Gupta',     branch: 'ECE',        cgpa: 7.8, activeBacklogs: 0, totalBacklogs: 1, ats: 74, platform: 'LeetCode',   rating: 1540, solved: 240, placed: '',              ctc: '',           status: 'Processing', skills: ['C','VHDL','Embedded C','Python','MATLAB'] },
  { name: 'Sneha Patel',     branch: 'CSE',        cgpa: 9.3, activeBacklogs: 0, totalBacklogs: 0, ats: 91, platform: 'Codeforces', rating: 1920, solved: 510, placed: 'Amazon',        ctc: '₹35 LPA',   status: 'Placed',     skills: ['Python','ML','TensorFlow','Deep Learning','SQL'] },
  { name: 'Karan Verma',     branch: 'Mechanical', cgpa: 6.4, activeBacklogs: 2, totalBacklogs: 3, ats: 48, platform: 'LeetCode',   rating: 850,  solved: 65,  placed: '',              ctc: '',           status: 'Unplaced',   skills: ['AutoCAD','SolidWorks','MATLAB','C'] },
  { name: 'Ananya Rao',      branch: 'ICT',        cgpa: 8.2, activeBacklogs: 0, totalBacklogs: 0, ats: 79, platform: 'LeetCode',   rating: 1620, solved: 290, placed: 'Infosys',       ctc: '₹9.5 LPA',  status: 'Placed',     skills: ['Java','Angular','Spring','MySQL','Docker'] },
  { name: 'Vikram Singh',    branch: 'CSE',        cgpa: 7.5, activeBacklogs: 0, totalBacklogs: 2, ats: 71, platform: 'CodeChef',   rating: 1480, solved: 180, placed: '',              ctc: '',           status: 'Unplaced',   skills: ['JavaScript','Node.js','MongoDB','React','CSS'] },
  { name: 'Pooja Nair',      branch: 'Civil',      cgpa: 6.8, activeBacklogs: 1, totalBacklogs: 2, ats: 52, platform: 'LeetCode',   rating: 920,  solved: 70,  placed: '',              ctc: '',           status: 'Unplaced',   skills: ['AutoCAD','STAAD Pro','Revit','Excel'] },
  { name: 'Aditya Kumar',    branch: 'CSE',        cgpa: 8.9, activeBacklogs: 0, totalBacklogs: 0, ats: 85, platform: 'LeetCode',   rating: 1780, solved: 380, placed: 'Flipkart',      ctc: '₹22 LPA',   status: 'Placed',     skills: ['Go','Kubernetes','Docker','Redis','PostgreSQL'] },
  { name: 'Divya Krishnan',  branch: 'ECE',        cgpa: 7.2, activeBacklogs: 0, totalBacklogs: 1, ats: 66, platform: 'Codeforces', rating: 1310, solved: 150, placed: '',              ctc: '',           status: 'Unplaced',   skills: ['Python','Signal Processing','MATLAB','C++','OpenCV'] },
  { name: 'Rohit Jain',      branch: 'CSE',        cgpa: 6.1, activeBacklogs: 3, totalBacklogs: 4, ats: 40, platform: 'LeetCode',   rating: 650,  solved: 42,  placed: '',              ctc: '',           status: 'Unplaced',   skills: ['HTML','CSS','JavaScript'] },
  { name: 'Meghna Tiwari',   branch: 'ICT',        cgpa: 8.5, activeBacklogs: 0, totalBacklogs: 0, ats: 80, platform: 'LeetCode',   rating: 1690, solved: 330, placed: 'Wipro',         ctc: '₹7.5 LPA',  status: 'Placed',     skills: ['Python','Django','REST API','PostgreSQL','Linux'] },
  { name: 'Siddharth Roy',   branch: 'Mechanical', cgpa: 7.1, activeBacklogs: 0, totalBacklogs: 1, ats: 62, platform: 'CodeChef',   rating: 1200, solved: 110, placed: '',              ctc: '',           status: 'Unplaced',   skills: ['SolidWorks','ANSYS','C','Python','MATLAB'] },
  { name: 'Kavya Reddy',     branch: 'CSE',        cgpa: 9.0, activeBacklogs: 0, totalBacklogs: 0, ats: 89, platform: 'Codeforces', rating: 1870, solved: 460, placed: 'Uber',          ctc: '₹30 LPA',   status: 'Placed',     skills: ['Java','Kafka','Microservices','Docker','AWS'] },
  { name: 'Nikhil Sharma',   branch: 'EE',         cgpa: 6.9, activeBacklogs: 1, totalBacklogs: 1, ats: 55, platform: 'LeetCode',   rating: 980,  solved: 82,  placed: '',              ctc: '',           status: 'Unplaced',   skills: ['MATLAB','Simulink','C','Power Systems','Excel'] },
  { name: 'Shruti Agarwal',  branch: 'ICT',        cgpa: 8.0, activeBacklogs: 0, totalBacklogs: 0, ats: 77, platform: 'LeetCode',   rating: 1580, solved: 265, placed: 'TCS',           ctc: '₹7 LPA',    status: 'Placed',     skills: ['Python','SQL','Tableau','Excel','Data Analysis'] },
  { name: 'Ravi Shankar',    branch: 'CSE',        cgpa: 7.4, activeBacklogs: 0, totalBacklogs: 1, ats: 70, platform: 'CodeChef',   rating: 1420, solved: 195, placed: '',              ctc: '',           status: 'Processing', skills: ['C++','DSA','Unity','Game Dev','Python'] },
  { name: 'Lakshmi Iyer',    branch: 'ECE',        cgpa: 8.3, activeBacklogs: 0, totalBacklogs: 0, ats: 81, platform: 'LeetCode',   rating: 1640, solved: 302, placed: 'HCL',           ctc: '₹10 LPA',   status: 'Placed',     skills: ['VLSI','Verilog','Python','Embedded Systems','C'] },
  { name: 'Pranav Desai',    branch: 'CSE',        cgpa: 7.9, activeBacklogs: 0, totalBacklogs: 0, ats: 76, platform: 'Codeforces', rating: 1560, solved: 250, placed: '',              ctc: '',           status: 'Unplaced',   skills: ['React','NextJS','TypeScript','GraphQL','Firebase'] },
  { name: 'Nidhi Bhatt',     branch: 'Civil',      cgpa: 5.9, activeBacklogs: 4, totalBacklogs: 5, ats: 35, platform: 'LeetCode',   rating: 520,  solved: 28,  placed: '',              ctc: '',           status: 'Unplaced',   skills: ['AutoCAD','MS Project','Excel'] },
  { name: 'Amaan Khan',      branch: 'CSE',        cgpa: 8.6, activeBacklogs: 0, totalBacklogs: 0, ats: 83, platform: 'LeetCode',   rating: 1710, solved: 360, placed: 'Paytm',         ctc: '₹18 LPA',   status: 'Placed',     skills: ['Python','FastAPI','Redis','PostgreSQL','Docker'] },
  { name: 'Isha Choudhary',  branch: 'ICT',        cgpa: 7.6, activeBacklogs: 0, totalBacklogs: 1, ats: 73, platform: 'LeetCode',   rating: 1490, solved: 210, placed: '',              ctc: '',           status: 'Unplaced',   skills: ['Java','Android','Kotlin','Firebase','SQL'] },
  { name: 'Tushar Malik',    branch: 'Mechanical', cgpa: 6.5, activeBacklogs: 1, totalBacklogs: 2, ats: 49, platform: 'CodeChef',   rating: 870,  solved: 58,  placed: '',              ctc: '',           status: 'Unplaced',   skills: ['AutoCAD','SolidWorks','C','Excel','Ansys'] },
  { name: 'Riya Kapoor',     branch: 'CSE',        cgpa: 9.2, activeBacklogs: 0, totalBacklogs: 0, ats: 90, platform: 'Codeforces', rating: 1900, solved: 490, placed: 'Razorpay',      ctc: '₹28 LPA',   status: 'Placed',     skills: ['Python','Django','PostgreSQL','Redis','Stripe API'] },
  { name: 'Abhishek Tomar',  branch: 'EE',         cgpa: 7.3, activeBacklogs: 0, totalBacklogs: 0, ats: 68, platform: 'LeetCode',   rating: 1350, solved: 162, placed: '',              ctc: '',           status: 'Unplaced',   skills: ['MATLAB','Python','Power Electronics','C','Arduino'] },
  { name: 'Simran Grover',   branch: 'ICT',        cgpa: 8.4, activeBacklogs: 0, totalBacklogs: 0, ats: 82, platform: 'LeetCode',   rating: 1660, solved: 315, placed: 'Accenture',     ctc: '₹11 LPA',   status: 'Placed',     skills: ['Java','Spring','Hibernate','SQL','JUnit'] },
  { name: 'Dev Acharya',     branch: 'CSE',        cgpa: 6.7, activeBacklogs: 2, totalBacklogs: 2, ats: 53, platform: 'LeetCode',   rating: 1050, solved: 90,  placed: '',              ctc: '',           status: 'Unplaced',   skills: ['PHP','MySQL','HTML','CSS','Bootstrap'] },
  { name: 'Pallavi Mishra',  branch: 'ECE',        cgpa: 7.7, activeBacklogs: 0, totalBacklogs: 0, ats: 75, platform: 'CodeChef',   rating: 1510, solved: 225, placed: '',              ctc: '',           status: 'Processing', skills: ['Python','IoT','Arduino','C','Raspberry Pi'] },
  { name: 'Gaurav Yadav',    branch: 'CSE',        cgpa: 8.8, activeBacklogs: 0, totalBacklogs: 0, ats: 86, platform: 'LeetCode',   rating: 1750, solved: 400, placed: 'Goldman Sachs', ctc: '₹26 LPA',   status: 'Placed',     skills: ['Java','Algorithms','System Design','SQL','Spring'] },
  { name: 'Tanvi Joshi',     branch: 'Chemical',   cgpa: 6.2, activeBacklogs: 2, totalBacklogs: 3, ats: 42, platform: 'LeetCode',   rating: 700,  solved: 45,  placed: '',              ctc: '',           status: 'Unplaced',   skills: ['MATLAB','Python','Excel','ChemCAD'] },
];

// Mock test categories
const testCategories = ['Aptitude', 'Coding', 'Core CS', 'Verbal', 'Data Structures'];

function randomTestScores() {
  const count = 2 + Math.floor(Math.random() * 3); // 2–4 tests
  return testCategories.slice(0, count).map(cat => ({
    category: cat,
    score: 5 + Math.floor(Math.random() * 15),
    total: 20,
    date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
  }));
}

function computeReadiness(student) {
  const cgpaScore = Math.min(student.cgpa / 10, 1) * 30;
  const atsScore = (student.ats / 100) * 25;
  const cpScore = Math.min(student.rating / 2500, 1) * 25;
  const backlogPenalty = student.activeBacklogs * 5;
  return Math.max(0, Math.round(cgpaScore + atsScore + cpScore - backlogPenalty));
}

// ─── MAIN SEED LOGIC (shared) ─────────────────────────────────────────────────
async function runSeed() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('pass123', salt);

  // Create CDC + base demo student first (like original seed.js)
  const cdcExists = await User.findOne({ email: 'cdc@demo.com' });
  if (!cdcExists) {
    const cdc = new User({ name: 'Central CDC Admin', email: 'cdc@demo.com', password: hashedPassword, role: 'cdc' });
    await cdc.save();
    console.log('  ✅ CDC Admin: cdc@demo.com');
  }

  const demoStudentExists = await User.findOne({ email: 'student@demo.com' });
  if (!demoStudentExists) {
    const demoStudent = new User({ name: 'Demo Student', email: 'student@demo.com', password: hashedPassword, role: 'student' });
    await demoStudent.save();
    const demoProfile = new Profile({ user: demoStudent._id });
    await demoProfile.save();
    console.log('  ✅ Demo Student: student@demo.com');
  }

  // Fetch existing jobs
  const existingJobs = await Job.find().lean();

  let created = 0;
  let skipped = 0;

  const branchPrefix = { CSE: '20CSE', ICT: '20ICT', ECE: '20ECE', Mechanical: '20ME', Civil: '20CV', EE: '20EE', Chemical: '20CH' };

  for (let i = 0; i < studentData.length; i++) {
    const s = studentData[i];
    const email = `student${i + 1}@demo.com`;
    const rollNo = `${branchPrefix[s.branch] || '20CSE'}${String(i + 1).padStart(3, '0')}`;

    const exists = await User.findOne({ email });
    if (exists) { skipped++; continue; }

    // 1. User
    const user = new User({ name: s.name, email, password: hashedPassword, role: 'student' });
    await user.save();

    // 2. Base Profile
    const profile = new Profile({
      user: user._id,
      email,
      rollNo,
      department: s.branch,
      cgpa: String(s.cgpa),
      year: 'Final Year',
      phone: `+91 ${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      location: ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune'][Math.floor(Math.random() * 5)] + ', India',
      portfolio: `${s.name.split(' ')[0].toLowerCase()}dev.dev`,
      skills: s.skills.map((name, idx) => ({
        name,
        level: 50 + Math.floor(Math.random() * 40),
        category: idx < 2 ? 'Languages' : 'Frameworks'
      })),
      education: [{
        degree: ['CSE','ICT'].includes(s.branch) ? 'B.Tech in Computer Science' : `B.Tech in ${s.branch} Engineering`,
        institution: 'Institute of Technology & Science',
        year: '2024',
        grade: `${s.cgpa} CGPA`,
        status: 'current'
      }],
      linkedin: `https://linkedin.com/in/${s.name.toLowerCase().replace(' ', '-')}`,
      github: `https://github.com/${s.name.split(' ')[0].toLowerCase()}`,
      bio: `${s.branch} student passionate about technology and innovation.`,
    });
    await profile.save();

    // 3. CDC Profile
    const cdcProfile = new CDCStudentProfile({
      user: user._id,
      rollNo,
      branch: s.branch,
      cgpa: s.cgpa,
      activeBacklogs: s.activeBacklogs,
      totalBacklogs: s.totalBacklogs,
      atsScore: s.ats,
      readinessScore: computeReadiness(s),
      placementStatus: s.status,
      placedAt: s.placed,
      ctcOffered: s.ctc,
      codingProfile: {
        platform: s.platform,
        handle: `${s.name.split(' ')[0].toLowerCase()}${i + 1}`,
        rating: s.rating,
        problemsSolved: s.solved,
      },
      mockTestScores: randomTestScores(),
      resumeUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    });
    await cdcProfile.save();

    // 4. Applications
    if (existingJobs.length > 0) {
      const numApps = 1 + Math.floor(Math.random() * Math.min(2, existingJobs.length));
      const statuses = ['applied', 'in-progress', 'shortlisted', 'offered', 'rejected'];
      const shuffled = [...existingJobs].sort(() => 0.5 - Math.random());

      for (let j = 0; j < numApps; j++) {
        const job = shuffled[j];
        const existingApp = await Application.findOne({ student: user._id, job: job._id });
        if (existingApp) continue;

        const randomStatus = s.status === 'Placed' ? 'accepted' : statuses[Math.floor(Math.random() * statuses.length)];
        const app = new Application({
          job: job._id, student: user._id, status: randomStatus,
          currentRound: 0, totalRounds: 3,
          rounds: [{ name: 'Online Assessment', status: 'passed', date: 'Sep 10', score: `${60 + Math.floor(Math.random() * 35)}/100` }],
        });
        await app.save();
      }
    }

    created++;
    console.log(`  ✅ ${s.name} (${email})`);
  }

  console.log(`\n🎉 Seeding complete! Created: ${created}, Skipped: ${skipped}`);
  console.log(`📌 CDC: cdc@demo.com | Students: student1@demo.com to student${studentData.length}@demo.com | pass: pass123`);
  return { created, skipped };
}

// ─── IN-PROCESS EXPORT (for server.js auto-seed) ─────────────────────────────
async function autoSeed() {
  return runSeed();
}
module.exports = { autoSeed };

// ─── STANDALONE RUN ───────────────────────────────────────────────────────────
if (require.main === module) {
  (async () => {
    try {
      await mongoose.connect(MONGO_URI);
      console.log('✅ Connected to MongoDB');
      await runSeed();
      mongoose.connection.close();
    } catch (err) {
      console.error('Seeding error:', err);
      process.exit(1);
    }
  })();
}

