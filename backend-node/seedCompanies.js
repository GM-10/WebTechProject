/**
 * seedCompanies.js
 * Seeds realistic companies with full eligibility criteria for demo purposes.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Job = require('./models/Job');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/placement_ecosystem';

const companyData = [
  {
    company: 'Google',
    role: 'Software Engineer',
    location: 'Bangalore',
    type: 'Full Time',
    ctc: '₹32-40 LPA',
    companyCTC: 35,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    description: 'Join Google Cloud and build scalable systems processing billions of queries.',
    driveStatus: 'active',
    logo: 'G',
    logoColor: '#4285f4',
    tags: ['Python', 'System Design', 'Cloud', 'C++'],
    eligibilityCriteria: {
      minCGPA: 8.0,
      allowedBranches: ['CSE', 'ICT'],
      maxTotalBacklogs: 0,
      allowActiveBacklogs: false,
      requiredSkills: ['Python', 'DSA', 'System Design'],
      alreadyPlacedRestriction: true,
    },
    roundDetails: [
      { name: 'Online Assessment', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), time: '10:00 AM' },
      { name: 'Technical Interview Round 1', date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'Technical Interview Round 2', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), time: '03:00 PM' },
      { name: 'HR Interview', date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), time: '11:00 AM' }
    ],
    bondInfo: { hasBond: true, bondDuration: 12 }
  },
  {
    company: 'Amazon',
    role: 'SDE-1 (Graduate)',
    location: 'Hyderabad',
    type: 'Full Time',
    ctc: '₹28-36 LPA',
    companyCTC: 30,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    description: 'Work on Amazon Retail and AWS infrastructure.',
    driveStatus: 'active',
    logo: 'A',
    logoColor: '#ff9900',
    tags: ['Java', 'Algorithms', 'AWS'],
    eligibilityCriteria: {
      minCGPA: 7.5,
      allowedBranches: ['CSE', 'ICT', 'ECE'],
      maxTotalBacklogs: 1,
      allowActiveBacklogs: false,
      requiredSkills: ['Java', 'DSA'],
      alreadyPlacedRestriction: false,
    },
    roundDetails: [
      { name: 'Online CodeChef Contest', date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), time: '05:00 PM' },
      { name: 'Technical Interview 1', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'Technical Interview 2', date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'Bar Raiser Interview', date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), time: '03:00 PM' }
    ],
    bondInfo: { hasBond: true, bondDuration: 6 }
  },
  {
    company: 'Microsoft',
    role: 'Software Engineer',
    location: 'Noida',
    type: 'Full Time',
    ctc: '₹25-35 LPA',
    companyCTC: 28,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    description: 'Build modern cloud services and developer tools.',
    driveStatus: 'scheduled',
    logo: 'M',
    logoColor: '#00a4ef',
    tags: ['C#', 'Azure', '.NET', 'React'],
    eligibilityCriteria: {
      minCGPA: 7.0,
      allowedBranches: ['CSE', 'ICT', 'EE'],
      maxTotalBacklogs: 1,
      allowActiveBacklogs: true,
      requiredSkills: [],
      alreadyPlacedRestriction: false,
    },
    roundDetails: [
      { name: 'Online Assessment', date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), time: '10:00 AM' },
      { name: 'Technical Interview', date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'HR Round', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), time: '03:00 PM' }
    ],
    bondInfo: { hasBond: false, bondDuration: 0 }
  },
  {
    company: 'Flipkart',
    role: 'Backend Engineer',
    location: 'Bangalore',
    type: 'Full Time',
    ctc: '₹20-28 LPA',
    companyCTC: 24,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    description: 'Build e-commerce infrastructure serving millions of users.',
    driveStatus: 'active',
    logo: 'F',
    logoColor: '#f89500',
    tags: ['Java', 'Microservices', 'Kafka', 'MySQL'],
    eligibilityCriteria: {
      minCGPA: 7.0,
      allowedBranches: ['CSE', 'ICT'],
      maxTotalBacklogs: 2,
      allowActiveBacklogs: true,
      requiredSkills: ['Java'],
      alreadyPlacedRestriction: false,
    },
    roundDetails: [
      { name: 'Machine Round', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'Technical Interview', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'Manager Round', date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), time: '03:00 PM' }
    ],
    bondInfo: { hasBond: false, bondDuration: 0 }
  },
  {
    company: 'Infosys',
    role: 'Systems Engineer',
    location: 'Pune',
    type: 'Full Time',
    ctc: '₹9-13 LPA',
    companyCTC: 11,
    deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    description: 'Join Infosys as a Systems Engineer for full-stack development.',
    driveStatus: 'active',
    logo: 'I',
    logoColor: '#003da5',
    tags: ['Java', 'Spring', 'SQL'],
    eligibilityCriteria: {
      minCGPA: 6.5,
      allowedBranches: ['CSE', 'ICT', 'ECE', 'EE'],
      maxTotalBacklogs: 3,
      allowActiveBacklogs: true,
      requiredSkills: [],
      alreadyPlacedRestriction: false,
    },
    roundDetails: [
      { name: 'Aptitude Test', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), time: '10:00 AM' },
      { name: 'Technical Interview', date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), time: '11:00 AM' },
      { name: 'HR Round', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), time: '02:00 PM' }
    ],
    bondInfo: { hasBond: false, bondDuration: 0 }
  },
  {
    company: 'TCS',
    role: 'IT Associate',
    location: 'Multiple',
    type: 'Full Time',
    ctc: '₹7-10 LPA',
    companyCTC: 8,
    deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    description: 'Join TCS services division for global IT solutions.',
    driveStatus: 'scheduled',
    logo: 'T',
    logoColor: '#ec1c24',
    tags: ['Java', 'C++', 'Mainframe'],
    eligibilityCriteria: {
      minCGPA: 6.0,
      allowedBranches: ['CSE', 'ICT', 'ECE', 'Mechanical', 'Civil', 'EE'],
      maxTotalBacklogs: 5,
      allowActiveBacklogs: true,
      requiredSkills: [],
      alreadyPlacedRestriction: false,
    },
    roundDetails: [
      { name: 'Online Assessment', date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), time: '10:00 AM' },
      { name: 'Technical Interview', date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'HR Round', date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000), time: '03:00 PM' }
    ],
    bondInfo: { hasBond: false, bondDuration: 0 }
  },
  {
    company: 'Goldman Sachs',
    role: 'Software Developer',
    location: 'Bangalore',
    type: 'Full Time',
    ctc: '₹26-32 LPA',
    companyCTC: 28,
    deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    description: 'Develop trading systems and finance technology solutions.',
    driveStatus: 'active',
    logo: 'GS',
    logoColor: '#0066cc',
    tags: ['C++', 'Java', 'Python', 'Finance'],
    eligibilityCriteria: {
      minCGPA: 8.5,
      allowedBranches: ['CSE', 'ICT', 'ECE'],
      maxTotalBacklogs: 0,
      allowActiveBacklogs: false,
      requiredSkills: ['C++', 'DSA'],
      alreadyPlacedRestriction: false,
    },
    roundDetails: [
      { name: 'Online Test', date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'Round 1 - Technical', date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'Round 2 - Technical', date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'HR & Behavioral', date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), time: '03:00 PM' }
    ],
    bondInfo: { hasBond: true, bondDuration: 24 }
  },
  {
    company: 'Paytm',
    role: 'Full Stack Engineer',
    location: 'Bangalore',
    type: 'Full Time',
    ctc: '₹15-22 LPA',
    companyCTC: 18,
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    description: 'Build fintech products for India.',
    driveStatus: 'active',
    logo: 'P',
    logoColor: '#4d47a9',
    tags: ['Python', 'React', 'Node.js', 'Redis'],
    eligibilityCriteria: {
      minCGPA: 7.0,
      allowedBranches: ['CSE', 'ICT'],
      maxTotalBacklogs: 1,
      allowActiveBacklogs: false,
      requiredSkills: ['Python', 'JavaScript'],
      alreadyPlacedRestriction: false,
    },
    roundDetails: [
      { name: 'Coding Assessment', date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'Technical Interview', date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'HR Interview', date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), time: '03:00 PM' }
    ],
    bondInfo: { hasBond: false, bondDuration: 0 }
  },
  {
    company: 'Razorpay',
    role: 'Backend Software Engineer',
    location: 'Bangalore',
    type: 'Full Time',
    ctc: '₹24-30 LPA',
    companyCTC: 27,
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    description: 'Build payment infrastructure for India.',
    driveStatus: 'scheduled',
    logo: 'R',
    logoColor: '#528ff0',
    tags: ['Python', 'Django', 'PostgreSQL', 'Redis'],
    eligibilityCriteria: {
      minCGPA: 8.0,
      allowedBranches: ['CSE', 'ICT'],
      maxTotalBacklogs: 0,
      allowActiveBacklogs: false,
      requiredSkills: ['Python', 'PostgreSQL'],
      alreadyPlacedRestriction: true,
    },
    roundDetails: [
      { name: 'Online Coding Round', date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'Technical Interview 1', date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'Technical Interview 2', date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), time: '02:00 PM' },
      { name: 'HR Round', date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), time: '03:00 PM' }
    ],
    bondInfo: { hasBond: true, bondDuration: 6 }
  }
];

async function seedCompanies() {
  const hasConnection = mongoose.connection.readyState === 1;
  try {
    if (!hasConnection) {
      await mongoose.connect(MONGO_URI);
      console.log('✅ Connected to MongoDB');
    }

    const existingCount = await Job.countDocuments();
    if (existingCount > 0) {
      console.log(`Companies already present (${existingCount}). Skipping company seed.`);
      if (!hasConnection) mongoose.connection.close();
      return { created: 0, skipped: existingCount };
    }

    // Create new companies
    let created = 0;
    for (const company of companyData) {
      const newCompany = new Job(company);
      await newCompany.save();
      created++;
      console.log(`  ✅ ${company.company} - ${company.role}`);
    }

    console.log(`\n🎉 Companies seeding complete! Created: ${created}`);
    if (!hasConnection) mongoose.connection.close();
    return { created, skipped: 0 };
  } catch (err) {
    console.error('Seeding error:', err);
    if (!hasConnection && mongoose.connection.readyState === 1) mongoose.connection.close();
    throw err;
  }
}

async function autoSeedCompanies() {
  return seedCompanies();
}

module.exports = { autoSeedCompanies };

if (require.main === module) {
  seedCompanies().catch(() => process.exit(1));
}
