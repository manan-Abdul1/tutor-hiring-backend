const socketIo = require('socket.io');

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  // Use socket.rooms instead of activeUsers for room management
  io.on("connection", (socket) => {
    socket.on('generate-link', () => {
      socket.emit('video-link', socket.id);
    });

    socket.on("joinRoom", (roomID) => {
      socket.join(roomID);

      // Use socket.rooms instead of activeUsers
      const rooms = Array.from(socket.rooms);
      io.to(roomID).emit("allUsers", rooms);
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
      // Use socket.rooms instead of activeUsers
      const rooms = Array.from(socket.rooms);

      // Handle disconnection for each room the user is in
      rooms.forEach((roomID) => {
        io.to(roomID).emit('userDisconnected', { userId: socket.id });
      });
    });
  });

  return io;
};

module.exports = initSocket;
