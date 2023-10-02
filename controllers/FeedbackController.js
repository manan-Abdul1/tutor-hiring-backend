const Feedback = require('../models/feedback');

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

module.exports = {
  createFeedback,
};
