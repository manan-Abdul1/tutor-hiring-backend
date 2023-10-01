const Notification = require('../models/notificationSchema');
// Create a new notification
const createNotification = async (req, res) => {
    try {
      const { userId, message } = req.body;
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
      // console.log(notifications,'notification')

      const notifications = await Notification.find({ userId });
      console.log(notifications,'notification')
      res.status(200).json({
        notifications,
        message: 'Notification retireved successfully',
        ok: true,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  // Mark notification as read
  const markNotificationAsRead = async (req, res) => {
    try {
      console.log(req.query,'req.query')

      const notificationId = req.query.notificationId;
      console.log(notificationId,'notificationId')
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
  
  // Delete a notification
  const deleteNotification = async (req, res) => {
    try {
      const notificationId = req.query.notificationId;
      const notification = await Notification.findById(notificationId);
  
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found', ok: false });
      }
  
      await notification.remove();
  
      res.status(200).json({ message: 'Notification deleted successfully', ok: true });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const markAllAsRead = async (req, res) => {
    try {
      const userId = req.body.userId; 
     
      await Notification.updateMany({ userId: userId }, { $set: { isRead: true } });
  
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
    deleteNotification,
    markAllAsRead
};
