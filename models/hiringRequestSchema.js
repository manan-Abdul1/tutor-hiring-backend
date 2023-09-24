const mongoose = require('mongoose');

const hiringRequestSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' }, 
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor' }, 
  status: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  timing: {
    type: Date,
    required: true,
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
