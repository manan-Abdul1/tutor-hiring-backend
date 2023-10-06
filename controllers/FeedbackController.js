const Feedback = require('../models/FeedbackSchema');

const createFeedback = async (req, res) => {
  try {
    const { userId, teacherId, rating, comment } = req.body;
    
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

const getFeedbackByUser = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      const feedback = await Feedback.find({ userId });
  
      res.status(200).json(feedback);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

const deleteFeedback = async (req, res) => {
    try {
      const feedbackId = req.params.feedbackId;
  
      await Feedback.findByIdAndDelete(feedbackId);
  
      res.status(200).json({ message: 'Feedback deleted successfully', ok: true });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
module.exports = {
  createFeedback,
  getFeedbackForTeacher
};
