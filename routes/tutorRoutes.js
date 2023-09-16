const express = require('express');
const router = express.Router();
const { registerTutor,tutorsLogin, getAllTeachers } = require('../controllers/tutorController');

// Define the routes for Teachers
router.post('/register', registerTutor);
router.post('/tutors-login', tutorsLogin);
router.get('/get-all-teachers', getAllTeachers);


module.exports = router;
