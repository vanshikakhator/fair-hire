require('dotenv').config();
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

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`)
});
const upload = multer({ storage });

const app = express();
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 files
app.use(cors());
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fairhire';

mongoose.connect(MONGO_URI).then(() => console.log('MongoDB Connected')).catch(err => console.error(err));

// Auth Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) { res.status(401).json({ message: 'Invalid token' }); }
};

// --- FILE UPLOAD ---
app.post('/api/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email: email.toLowerCase().trim(), password: hashedPassword, role, ...rest });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role, companyName: user.companyName }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, role: user.role, email: user.email } });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role, companyName: user.companyName }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, role: user.role, email: user.email, companyName: user.companyName } });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

app.put('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select('-password');
  res.json(user);
});

// --- JOB ROUTES ---
app.post('/api/jobs', authMiddleware, async (req, res) => {
  const job = new Job({ ...req.body, recruiterId: req.user.id, company: req.user.companyName });
  await job.save(); res.json(job);
});

app.get('/api/jobs', authMiddleware, async (req, res) => {
  if (req.user.role === 'recruiter') {
    const jobs = await Job.find({ recruiterId: req.user.id }).sort({ createdAt: -1 });
    const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
      const apps = await Application.find({ jobId: job._id });
      return { ...job.toObject(), applicants: apps.length, qualified: apps.filter(a => a.atsScore >= 80).length };
    }));
    return res.json(jobsWithCounts);
  }
  const jobs = await Job.find({ status: 'Active' }).sort({ createdAt: -1 });
  res.json(jobs);
});

// --- AI ANALYSIS ROUTE (With Base64 File Content) ---
app.post('/api/jobs/:jobId/analyze', authMiddleware, async (req, res) => {
  if (req.user.role !== 'recruiter') return res.status(403).json({ message: 'Forbidden' });
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const applications = await Application.find({ jobId: req.params.jobId }).populate('studentId');
    
    console.log(`Analyzing ${applications.length} applications for job: ${job.role}`);

    const resumesData = applications.map(app => {
      let base64Content = null;
      const relativePath = app.resumePath || app.studentId?.resumePath;
      if (relativePath) {
        // Fix path resolution: handles leading slash and ensures it's relative to backend root
        const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
        const fullPath = path.resolve(__dirname, cleanPath);
        
        if (fs.existsSync(fullPath)) {
          try {
            base64Content = fs.readFileSync(fullPath).toString('base64');
          } catch (e) {
            console.error(`Error reading file at ${fullPath}:`, e.message);
          }
        } else {
          console.warn(`File not found: ${fullPath}`);
        }
      }

      return {
        candidate_name: `${app.studentId?.firstName || app.firstName || "Anonymous"} ${app.studentId?.lastName || app.lastName || ""}`,
        candidate_email: app.studentId?.email || app.email || "no-email@provided.com",
        resume_base64: base64Content,
        resume_filename: relativePath ? path.basename(relativePath) : "resume.pdf",
        skills: app.studentId?.skills || [],
        experience: app.studentId?.experience || "",
        application_id: app._id
      };
    });

    const payload = {
      job_description_text: job.description || "No description provided",
      resumes: resumesData
    };

    const webhookUrl = 'https://rahulrockstar.app.n8n.cloud/webhook/airesume';
    const testWebhookUrl = 'https://rahulrockstar.app.n8n.cloud/webhook-test/airesume';
    
    console.log(`Sending payload to n8n: ${webhookUrl} (${resumesData.length} resumes)...`);

    let n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // Fallback to test webhook if production returns 404
    if (n8nResponse.status === 404) {
      console.log('Production webhook returned 404, trying test webhook...');
      n8nResponse = await fetch(testWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    const responseText = await n8nResponse.text();
    console.log(`N8N Status: ${n8nResponse.status}`);

    if (!n8nResponse.ok) {
      console.error(`N8N Error Details: ${responseText}`);
      const errorMessage = n8nResponse.status === 404 
        ? "N8N Workflow Not Found. Ensure your n8n workflow is active or currently executing."
        : `N8N Error: ${n8nResponse.status}`;
      throw new Error(errorMessage);
    }

    if (!responseText) {
      console.warn('N8N returned an empty response body.');
      return res.json([]);
    }

    try {
      const jsonData = JSON.parse(responseText);
      res.json(jsonData);
    } catch (parseError) {
      console.error('Failed to parse N8N response as JSON:', responseText);
      res.status(500).json({ message: 'Invalid response from n8n', raw: responseText });
    }
  } catch (error) {
    console.error('Analysis Route Error:', error);
    res.status(500).json({ message: error.message || 'Analysis failed' });
  }
});

// --- APPLICATION ROUTES ---
app.post('/api/applications', authMiddleware, async (req, res) => {
  const application = new Application({ ...req.body, studentId: req.user.id });
  await application.save(); res.json(application);
});

app.get('/api/applications', authMiddleware, async (req, res) => {
  if (req.user.role === 'student') return res.json(await Application.find({ studentId: req.user.id }).populate('jobId'));
  res.json(await Application.find({ jobId: req.query.jobId }).populate('studentId', '-password'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
