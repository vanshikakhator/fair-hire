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
  university: String,
  // Fields for recruiter
  companyName: String,
  recruiterName: String,
  jobTitle: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
