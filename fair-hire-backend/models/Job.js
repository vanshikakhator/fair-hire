const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: { type: String, required: true },
  workMode: { type: String, required: true }, // e.g. "Remote", "Hybrid", "On-site"
  skills: [String],
  description: { type: String, required: true },
  minCgpa: { type: String },
  status: { type: String, enum: ['Active', 'Paused'], default: 'Active' },
  // Optional mock-friendly fields from the UI
  location: { type: String, default: "Remote" },
  company: { type: String }, 
  badge: { type: String },
  badgeTone: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
