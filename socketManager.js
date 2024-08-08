// socketManager.js
const { Server } = require('socket.io');

let io; // To hold the reference to the Socket.IO instance

// Initialize Socket.IO instance
const initSocketIO = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:8081",
        "http://localhost:5000",
        "http://192.168.10.20:8081",
        "exp://192.168.10.20:8081"
      ],
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('register', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined room`);
    });

    socket.on('sendMessage', (message) => {
      io.to(message.receiverId).emit('receiveMessage', message);
    });

    socket.on('joinRoom', (room) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

// Export the functions and the io instance
module.exports = { initSocketIO, io };

