require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// Import route files
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const analyticsRoutes = require('./routes/analytics');
const dashboardRoutes = require('./routes/dashboard');
const testRoutes = require('./routes/tests');
const cdcStudentsRoutes = require('./routes/cdcStudents');
const announcementsRoutes = require('./routes/announcements');



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to req for route usage
app.use((req, res, next) => {
  req.io = io;
  next();
});


// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Campus Placement API is online.', health: '/api/health' });
});

app.get('/api/health', (req, res) => {

  res.status(200).json({ status: 'Backend is running correctly.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/cdc', cdcStudentsRoutes);
app.use('/api/announcements', announcementsRoutes);



// Socket.io for Real-time Notifications
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('application:update', (data) => {
    // Broadcast application status updates to relevant users
    socket.broadcast.emit('notification', {
      type: 'application_update',
      message: `Application status updated for ${data.role} at ${data.company}`,
      data
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/placement_ecosystem';

/**
 * Optimized Start Sequence:
 * Start the server immediately so the frontend can "reach" it.
 * Then connect to MongoDB in the background.
 */
const startServer = async () => {
  // 1. Fire up the HTTP server first
  server.listen(PORT, () => {
    console.log(`🚀 API Server is LIVE on port ${PORT}`);
    console.log('📡 Background: Attempting to connect to MongoDB...');
  });

  // 2. Background DB Connection
    try {
      console.log('Attempting to connect to MongoDB with URI:', MONGO_URI.split('@')[0] + '@***');
      await mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 5000, 
      });
      console.log('✅ MongoDB connected successfully');
    } catch (primaryErr) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Primary MongoDB connection failed. Initializing MongoMemoryServer for development fallback...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        await mongoose.connect(uri);
        console.log('Connected to In-Memory MongoDB at:', uri);
      } else {
        throw primaryErr;
      }
    }

    try {
      // Seeding logic
      const User = require('./models/User');
      const Job = require('./models/Job');
      const { Question } = require('./models/Test');
      
      const cdcExists = await User.findOne({ role: 'cdc' });
      if (!cdcExists) {
        console.log('🌱 Fresh DB: Running auto-seed...');
        const { autoSeed } = require('./seedStudents');
        await autoSeed();
        console.log('Auto-seed complete!');
      }

      const jobsCount = await Job.countDocuments();
      if (jobsCount === 0) {
        console.log('No companies found — running company seed...');
        const { autoSeedCompanies } = require('./seedCompanies');
        await autoSeedCompanies();
        console.log('Company seed complete!');
      }

      const questionsCount = await Question.countDocuments();
      if (questionsCount < 170) {
        console.log(`Question bank expansion needed (${questionsCount}/180) — running seed...`);
        const { seedQuestions } = require('./seedQuestions');
        await seedQuestions();
        console.log('Domain expansion seed complete!');
      }
    } catch (seedErr) {
      console.warn('Auto-seed warning:', seedErr.message);
    }
};

startServer();

