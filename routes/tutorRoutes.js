const express = require('express');
const router = express.Router();
const { registerTutor,tutorsLogin } = require('../controllers/tutorController');

// Define the routes for Teachers
router.post('/register', registerTutor);
router.post('/tutors-login', tutorsLogin);


module.exports = router;
