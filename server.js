const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const studentRoutes = require('./routes/studentRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const hiringRequestRoutes = require('./routes/hiringRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const dbconfig = require('./connection/db');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);

const io =  socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  },
});

const activeUsers = {};

io.on("connection", (socket) => {
  socket.on('generate-link', () => {
    socket.emit('video-link', socket.id);
  });

  socket.on("joinRoom", (roomID) => {
    socket.join(roomID);
    activeUsers[socket.id] = roomID;

    io.to(roomID).emit("allUsers", Array.from(io.sockets.adapter.rooms.get(roomID)));
  });

  socket.on("sendingSignal", (payload) => {
    io.to(payload.userToSignal).emit("userJoined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returningSignal", (payload) => {
    io.to(payload.callerID).emit("receivingReturnedSignal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on('disconnect', () => {
    const roomID = activeUsers[socket.id];
    if (roomID) {
      io.to(roomID).emit('userDisconnected', { userId: socket.id });
      delete activeUsers[socket.id];
    }
  });
});

app.use(express.json());
app.use(cors());

app.use('/api/users', studentRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/hiringRequest', hiringRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);


server.listen(port, () => console.log("Server started", port));