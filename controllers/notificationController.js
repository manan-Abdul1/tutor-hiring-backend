const Notification = require('../models/notificationSchema');
// Create a new notification
const createNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'User ID and message are required', ok: false });
    }

    const newNotification = new Notification({
      userId,
      message,
      isRead: false,
    });

    await newNotification.save();

    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get notifications by user ID
const getNotificationsByUserId = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required', ok: false });
    }

    const notifications = await Notification.find({ userId }).sort({createdAt: -1});

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for the given user ID', ok: false });
    }

    res.status(200).json({
      notifications,
      message: 'Notifications retrieved successfully',
      ok: true,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error', ok: false });
  }
};


// Mark notification as read
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.query.notificationId;
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found', ok: false });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read', ok: true });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete all notification
const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required', ok: false });
    }

    const result = await Notification.deleteMany({ userId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No notifications found for the user', ok: false });
    }

    res.status(200).json({ message: 'All notifications deleted successfully', ok: true });
  } catch (error) {
    console.error('Error deleting notifications:', error);
    res.status(500).json({ error: 'Internal server error', ok: false });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required', ok: false });
    }

    const result = await Notification.updateMany({ userId: userId }, { $set: { isRead: true } });
    if (result.nModified === 0) {
      return res.status(404).json({ message: 'No notifications found for the user', ok: false });
    }
    res.status(200).json({ message: 'All notifications marked as read', ok: true });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ error: 'Internal server error', ok: false });
  }
};

module.exports = {
  createNotification,
  getNotificationsByUserId,
  markNotificationAsRead,
  deleteAllNotifications,
  markAllAsRead
};
