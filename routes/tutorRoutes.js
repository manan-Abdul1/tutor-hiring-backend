const express = require('express');
const router = express.Router();
const { registerTutor } = require('../controllers/tutorController');

// Define the routes for Teachers
router.post('/register', registerTutor);


module.exports = router;
