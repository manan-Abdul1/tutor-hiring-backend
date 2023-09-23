const mongoose = require('mongoose');

const hiringRequestSchema = new mongoose.Schema({
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
const hiringRequestData = mongoose.model('Requests', hiringRequestSchema);

module.exports = hiringRequestData;
