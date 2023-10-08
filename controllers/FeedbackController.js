const Feedback = require('../models/FeedbackSchema');
const Notification = require('../models/notificationSchema');
const Tutor = require('../models/tutorSchema');
const User = require('../models/studentSchema');
const { sendEmail } = require('../services/mailServices');


const createFeedback = async (req, res) => {
  try {
    const { userId, teacherId, rating, comment } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found', ok: false });
    }

    // Check if the teacher exists
    const teacher = await Tutor.findById({ _id: teacherId });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found', ok: false });
    }

    // Validate rating and comment
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5', ok: false });
    }

    if (comment.trim() === '') {
      return res.status(400).json({ error: 'Comment cannot be empty', ok: false });
    }

    // Create feedback
    const feedback = new Feedback({
      userId,
      teacherId,
      rating,
      comment,
    });

    await feedback.save();

    // Create a notification
    const notification = new Notification({
      userId: teacherId,
      message: 'You received new feedback from a student.',
      eventType: 'feedback',
      eventDetails: { feedbackId: feedback._id },
    });

    await notification.save();

    // Send an email
    const { email } = teacher;
    const recipientEmail = email;
    const emailSubject = 'New Feedback Received';
    const emailMessage = `You received new feedback from a student. Rating: ${rating}, Comment: ${comment}`;

    await sendEmail(recipientEmail, emailSubject, emailMessage);

    res.status(201).json({ message: 'Feedback Submitted!', ok: true });
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal server error', ok: false });
  }
};



const getFeedbackForTeacher = async (req, res) => {
    try {
      const teacherId = req.query.id;
      
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
