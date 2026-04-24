const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  coverNote: String,
  linkedinUrl: String,
  githubUrl: String,
  resumePath: String, // Path or URL to the parsed resume
  status: {
    type: String,
    enum: ['Pending', 'Applied', 'Shortlisted', 'Accepted', 'Rejected'],
    default: 'Applied'
  },
  atsScore: {
    type: Number,
    default: Math.floor(Math.random() * (100 - 60 + 1)) + 60 // Mock ATS score for now
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
