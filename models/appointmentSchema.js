const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
    },
    teacherId: {
        type: String,
        required: true,
    },
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
    }
});

// Create a model based on the schema
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
