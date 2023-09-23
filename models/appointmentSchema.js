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
    createdAt: {
        type: String,
        // ISODate("timestamp"),
    },
    updatedAt: {
        type: String,
        // ISODate("timestamp"),
    }
});

// Create a model based on the schema
const appointmentData = mongoose.model('Appointments', appointmentSchema);

module.exports = appointmentData;
