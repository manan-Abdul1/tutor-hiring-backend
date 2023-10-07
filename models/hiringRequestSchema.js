const mongoose = require('mongoose');

const hiringRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, 
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' }, 
  status: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  payment: {
    type: String,
    required: true,
  },
  timing: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  preferredLocation: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const HiringRequest = mongoose.model('HiringRequest', hiringRequestSchema);

module.exports = HiringRequest;
