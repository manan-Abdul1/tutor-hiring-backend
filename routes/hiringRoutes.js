const express = require('express');
const router = express.Router();
const { createHiringRequest, getTeacherRequestsById, updateRequestStatus, acceptRequest } = require('../controllers/hiringRequestController');

// Define the routes for students
router.post('/', createHiringRequest);
router.get('/getTeacherRequestsById', getTeacherRequestsById);
// router.put('/acceptRequest', updateRequestStatus);
router.put('/acceptRequest', acceptRequest);


module.exports = router;
