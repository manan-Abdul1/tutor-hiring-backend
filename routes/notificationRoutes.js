const express = require('express');
const { createNotification, getNotificationsByUserId, markNotificationAsRead, deleteNotification, markAllAsRead } = require('../controllers/notificationController');
const router = express.Router();

// Define the routes for notifications
router.post('/', createNotification);
router.get('/', getNotificationsByUserId);
router.put('/mark-read', markNotificationAsRead);
router.post('/mark-all-as-read', markAllAsRead);
router.delete('/deleteNotification', deleteNotification);

module.exports = router;
