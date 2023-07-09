const express = require('express');
const router = express.Router();

// Define the routes for students
router.post('/register', registerStudent);


module.exports = router;
