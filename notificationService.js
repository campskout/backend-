// notificationService.js
const { io } = require('./socketManager');

// Notify user function using rooms
const notifyUser = (userId, message) => {
  if (io) {
    console.log(`Notifying user ${userId}: ${message}`);
    io.to(userId).emit('notification', { userId, message });
  } else {
    console.error('Socket.IO instance is not initialized.');
  }
};

module.exports = { notifyUser };


