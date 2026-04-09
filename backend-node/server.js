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

async function startServer() {
  let uri = MONGO_URI;
  if (!process.env.MONGO_URI) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('Started In-Memory MongoDB for local development');
    } catch (err) {
      console.log('In-Memory MongoDB start failed.', err.message);
    }
  }

  mongoose.connect(uri)
    .then(async () => {
      console.log('MongoDB connected successfully');
      server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

      // Auto-seed on fresh DB (no CDC user exists yet)
      try {
        const User = require('./models/User');
        const Job = require('./models/Job');
        const cdcExists = await User.findOne({ role: 'cdc' });
        if (!cdcExists) {
          console.log('Fresh DB detected — running auto-seed...');
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
      } catch (seedErr) {
        console.warn('Auto-seed warning:', seedErr.message);
      }
    })
    .catch((err) => {
      console.warn('MongoDB connection failed:', err.message);
      server.listen(PORT, () => console.log(`Server running on port ${PORT} (Check MongoDB connection)`));
    });
}

startServer();

