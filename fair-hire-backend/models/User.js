const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'recruiter'],
    required: true
  },
  // Fields for student
  firstName: String,
  lastName: String,
  gender: String,
  phoneNo: String,
  skills: [String],
  experience: String,
  linkedinUrl: String,
  githubUrl: String,
  resumePath: String,
  education: {
    degreeType: String,
    institution: String,
    stream: String,
    graduationYear: String,
    isWorking: { type: Boolean, default: false }
  },
  // Fields for recruiter
  companyName: String,
  recruiterName: String,
  jobTitle: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
