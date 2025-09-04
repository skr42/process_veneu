const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');
require('dotenv').config();
// console.log("MONGO_URI:", process.env.MONGO_URI);

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const skillRoutes = require('./routes/skills');
const projectRoutes = require('./routes/projects');
const workRoutes = require('./routes/work');
const linkRoutes = require('./routes/links');
const searchRoutes = require('./routes/search');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });
// app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/skills', skillRoutes);
app.use('/projects', projectRoutes);
app.use('/work', workRoutes);
app.use('/links', linkRoutes);
app.use('/search', searchRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
