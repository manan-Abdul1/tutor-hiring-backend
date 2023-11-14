const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5500;
const studentRoutes = require('./routes/studentRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const hiringRequestRoutes = require('./routes/hiringRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const dbconfig = require('./connection/db');
const initSocket = require('./sockets/socket');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocket(server); // Ensure this function returns a Socket.IO instance

app.use(express.json());
app.use(cors());

app.use('/api/users', studentRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/hiringRequest', hiringRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);

// Handle Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected');
  
  // Add your Socket.IO event handlers here
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(port, () => console.log("Server started", port));
