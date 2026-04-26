const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${sanitized}`);
  }
});

const upload = multer({ storage });

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fairhire';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// --- FILE UPLOAD ROUTE ---
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) {
    console.log("Upload failed: No file received");
    return res.status(400).json({ message: 'No file uploaded' });
  }
  console.log(`File uploaded: ${req.file.filename} saved to ${req.file.path}`);
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, ...rest } = req.body;
    const lowerEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: lowerEmail });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email: lowerEmail, password: hashedPassword, role, ...rest });
    await user.save();
    
    const token = jwt.sign({ id: user._id, role: user.role, companyName: user.companyName }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, role: user.role, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: lowerEmail });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user._id, role: user.role, companyName: user.companyName }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, role: user.role, email: user.email, companyName: user.companyName } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.put('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const { 
      firstName, lastName, gender, phoneNo, skills, experience, 
      linkedinUrl, githubUrl, education, resumePath 
    } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        firstName, lastName, gender, phoneNo, skills, experience, 
        linkedinUrl, githubUrl, education, resumePath 
      },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// --- JOB ROUTES ---
app.post('/api/jobs', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ message: 'Only recruiters can post jobs' });
  try {
    const job = new Job({
      ...req.body,
      recruiterId: req.user.id,
      company: req.user.companyName
    });
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job', error: error.message });
  }
});

app.get('/api/jobs', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'recruiter') {
      // Recruiter sees only their own jobs
      const jobs = await Job.find({ recruiterId: req.user.id }).sort({ createdAt: -1 });
      
      // Also attach applicant counts
      const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
        const applications = await Application.find({ jobId: job._id });
        const qualifiedCount = applications.filter(a => a.atsScore >= 80).length;
        return {
          ...job.toObject(),
          applicants: applications.length,
          qualified: qualifiedCount
        };
      }));
      return res.json(jobsWithCounts);
    } else {
      // Student sees all active jobs
      const jobs = await Job.find({ status: 'Active' }).sort({ createdAt: -1 });
      res.json(jobs);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
});

// --- APPLICATION ROUTES ---
app.post('/api/applications', authMiddleware, async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Only students can apply' });
  try {
    const { jobId, coverNote, linkedinUrl, githubUrl, firstName, lastName, gender, email, resumePath } = req.body;
    
    // Check if already applied
    const existing = await Application.findOne({ studentId: req.user.id, jobId });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const application = new Application({
      studentId: req.user.id,
      jobId,
      coverNote,
      linkedinUrl,
      githubUrl,
      firstName,
      lastName,
      gender,
      email,
      resumePath
    });
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: 'Error applying', error: error.message });
  }
});

app.get('/api/applications', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'student') {
      const apps = await Application.find({ studentId: req.user.id }).populate('jobId');
      return res.json(apps);
    } else {
      // Recruiters fetching applications for their jobs
      // Need a jobId query param to get specific applications
      const { jobId } = req.query;
      if (!jobId) return res.status(400).json({ message: 'jobId is required' });
      
      const job = await Job.findById(jobId);
      if (job.recruiterId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
      }
      
      const apps = await Application.find({ jobId }).populate('studentId', '-password');
      res.json(apps);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
