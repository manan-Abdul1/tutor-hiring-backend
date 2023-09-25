const express = require('express');
const router = express.Router();
const { createHiringRequest, getTeacherRequestsById, updateRequestStatus, acceptRequest, rejectRequest } = require('../controllers/hiringRequestController');

// Define the routes for students
router.post('/', createHiringRequest);
router.get('/getTeacherRequestsById', getTeacherRequestsById);
// router.put('/acceptRequest', updateRequestStatus);
router.put('/acceptRequest', acceptRequest);
router.put('/rejectRequest', rejectRequest);


module.exports = router;
