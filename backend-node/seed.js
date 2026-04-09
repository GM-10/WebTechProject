const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Profile = require('./models/Profile');
const Job = require('./models/Job');
const Application = require('./models/Application');

const MONGO_URI = 'mongodb://localhost:27017/placement_ecosystem';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for advanced seeding...');

    // 1. Clean existing demo data
    await User.deleteMany({ email: { $in: ['student@demo.com', 'cdc@demo.com'] } });
    await Job.deleteMany({ company: { $in: ['Google', 'Amazon', 'Microsoft'] } });
    // Cleanup applications based on job presence or student later

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('pass123', salt);

    // 2. Create Demo CDC Admin
    const cdc = new User({
      name: 'Central CDC Admin',
      email: 'cdc@demo.com',
      password: hashedPassword,
      role: 'cdc'
    });
    await cdc.save();
    console.log('Demo CDC Admin created!');

    // 3. Create Demo Student
    const student = new User({
      name: 'Demo Student',
      email: 'student@demo.com',
      password: hashedPassword,
      role: 'student'
    });
    await student.save();
    const studentProfile = new Profile({ user: student.id });
    await studentProfile.save();
    console.log('Demo Student created!');

    // 4. Create Demo Jobs
    const googleJob = new Job({
      role: 'Software Engineer',
      company: 'Google',
      logo: 'G',
      logoColor: '#4285f4',
      location: 'Bangalore',
      type: 'Full Time',
      ctc: '₹25-35 LPA',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      tags: ['SDE', 'Python', 'Cloud'],
      description: 'Join the Google Cloud team to build next-gen scalability.',
      postedBy: cdc.id,
      applicantsCount: 120
    });
    await googleJob.save();

    const amazonJob = new Job({
      role: 'SDE-1 Graduate',
      company: 'Amazon',
      logo: 'A',
      logoColor: '#ff9900',
      location: 'Hyderabad',
      type: 'Full Time',
      ctc: '₹20-30 LPA',
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      tags: ['Java', 'Algorithms', 'High Scale'],
      description: 'Work with Amazon Retail systems on core backend features.',
      postedBy: cdc.id,
      applicantsCount: 550
    });
    await amazonJob.save();

    const microsoftJob = new Job({
        role: 'Frontend SDE Intern',
        company: 'Microsoft',
        logo: 'M',
        logoColor: '#00a4ef',
        location: 'Noida',
        type: 'Internship',
        ctc: '₹80K/month',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        tags: ['React', 'TypeScript', 'Web'],
        description: 'Build modern UIs for Microsoft Teams.',
        postedBy: cdc.id,
        applicantsCount: 200
    });
    await microsoftJob.save();
    console.log('Demo Jobs created!');

    // 5. Create Demo Applications for Student
    // Cleanup old ones to avoid duplicates
    await Application.deleteMany({ student: student.id });

    // Google Application (In Progress)
    const googleApp = new Application({
      job: googleJob.id,
      student: student.id,
      status: 'in-progress',
      currentRound: 1,
      totalRounds: 3,
      rounds: [
        { name: 'Online Assessment', status: 'passed', date: 'Oct 01', score: '85/100' },
        { name: 'Technical Interview', status: 'upcoming', date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), time: '02:00 PM' },
        { name: 'HR Interview', status: 'pending', date: 'TBD' }
      ]
    });
    await googleApp.save();

    // Amazon Application (Offered)
    const amazonApp = new Application({
      job: amazonJob.id,
      student: student.id,
      status: 'offered',
      currentRound: 3,
      totalRounds: 3,
      rounds: [
        { name: 'Coding Round', status: 'passed', date: 'Sep 25', score: '95/100' },
        { name: 'Tech Round', status: 'passed', date: 'Sep 28' },
        { name: 'Bar Raiser', status: 'passed', date: 'Sep 30' }
      ],
      offerDetails: {
        deadline: 'Oct 15, 2026',
        stipend: '₹1.5 Lakh/month (Pre-placement offer)',
        duration: 'Graduation Year',
        ctc: '₹30 LPA'
      }
    });
    await amazonApp.save();
    console.log('Demo Applications created!');

    console.log('\n--- ADVANCED SEEDING COMPLETE ---');
    console.log('Student Account: student@demo.com | pass123');
    console.log('CDC Account: cdc@demo.com | pass123');
    console.log('Check your Dashboard for Google interviews and Amazon offers!');
    
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();
