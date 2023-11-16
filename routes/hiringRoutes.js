const express = require("express");
const router = express.Router();
const {
  createHiringRequest,
  getTeacherRequestsById,
  updateRequestStatus,
  acceptRequest,
  rejectRequest,
  getAcceptedRequestByTutor,
  getAcceptedUserRequests,
  updateRequestStatusForUser,
  updateRequestStatusForTutor,
  getUserRequestsById,
  updateRequestVideoStatus,
  checkVideoStatus,
} = require("../controllers/hiringRequestController");

// Define the routes for students
router.post("/", createHiringRequest);
router.get("/getTeacherRequestsById", getTeacherRequestsById);
router.get("/getUserRequestsById", getUserRequestsById);
// router.put('/acceptRequest', updateRequestStatus);
router.put("/acceptRequest", acceptRequest);
router.put("/rejectRequest", rejectRequest);
router.get("/getAcceptedMeetings", getAcceptedRequestByTutor);
router.get("/getAcceptedUserMeetings", getAcceptedUserRequests);
router.put("/updateRequestStatusForUser", updateRequestStatusForUser);
router.put("/updateRequestStatusForTutor", updateRequestStatusForTutor);
router.put("/endVideo", updateRequestVideoStatus);
router.get("/isVideoEnded", checkVideoStatus);

module.exports = router;
