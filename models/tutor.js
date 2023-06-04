const mongoose = require('mongoose');

const tutorSchema = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    phoneNumber: Number,
    address: String,
    cnic: {
        type: Number,
        unique: true
    },
    location: String
});

const Tutors = mongoose.model('tutors', tutorSchema);
module.exports = Tutors;