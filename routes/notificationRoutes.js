const express = require('express');
const router = express.Router();

// Define the routes for notifications
router.post('/', createNotification);
router.get('/', getNotifcaitonsByUserId);
router.put('/mark-read', markNotificaitonAsRead);
router.delete('/deleteNotification', deleteNoticaiton);

module.exports = router;
