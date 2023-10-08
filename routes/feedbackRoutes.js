const express = require("express");
const router = express.Router();
const { 
    createFeedback
} = require("../controllers/FeedbackController");


router.post("/", createFeedback);

module.exports = router;
