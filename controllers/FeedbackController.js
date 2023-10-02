const Feedback = require('../models/FeedbackSchema');

// Create a new feedback entry
const createFeedback = async (req, res) => {
  try {
    const { userId, teacherId, rating, comment } = req.body;
    
    // Create a new feedback entry
    const feedback = new Feedback({
      userId,
      teacherId,
      rating,
      comment,
    });

    await feedback.save();

    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all feedback entries for a specific teacher
const getFeedbackForTeacher = async (req, res) => {
    try {
      const teacherId = req.params.teacherId;
  
      const feedback = await Feedback.find({ teacherId });
  
      res.status(200).json(feedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
module.exports = {
  createFeedback,
  getFeedbackForTeacher
};
