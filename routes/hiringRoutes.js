const express = require('express');
const router = express.Router();
const { createHiringRequest, getTeacherRequestsById } = require('../controllers/hiringRequestController');

// Define the routes for students
router.post('/', createHiringRequest);
router.get('/getTeacherRequestsById', getTeacherRequestsById);


module.exports = router;
