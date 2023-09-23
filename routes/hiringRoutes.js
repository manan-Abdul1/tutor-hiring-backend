const express = require('express');
const router = express.Router();
const { createHiringRequest } = require('../controllers/hiringRequestController');

// Define the routes for students
router.post('/', createHiringRequest);


module.exports = router;
