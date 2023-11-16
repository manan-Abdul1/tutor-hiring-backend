const socketIo = require('socket.io');

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
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

  return io;
};

module.exports = initSocket;