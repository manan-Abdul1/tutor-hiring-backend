const express = require("express");
const router = express.Router();
const { 
    createFeedback, getFeedbackForTeacher
} = require("../controllers/FeedbackController");


router.post("/", createFeedback);
router.get("/getTutorsFeedack", getFeedbackForTeacher);

module.exports = router;
