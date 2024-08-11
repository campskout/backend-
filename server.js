const express = require('express');
const http = require('http');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { Server } = require('socket.io');
const usersRoutes = require('./routes/user.js');
const campsRoutes = require('./routes/camPost.js');
const joinPostRoutes = require('./routes/joinPost.js');
const experienceRoutes = require('./routes/experience.js');
const commentRoutes = require('./routes/comments.js');
const likeRoutes = require('./routes/like.js');
const joiningRequestRoutes = require('../backend-/routes/acceptAndReject.js');
const shareRoutes = require('./routes/share.js');
const prisma = require('./database/prisma.js');
const dashboardRoutes= require('./routes/dashboard.js')

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO instance
const io = new Server(server, {
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

// Room and Connection management
const userRooms = {}; // { userId: [roomIds] }
const userConnections = {}; // { userId: [socketIds] }

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('register', (userId) => {
    socket.join(userId.toString());
    console.log(`User ${userId} joined room`);

    if (!userConnections[userId]) {
      userConnections[userId] = [];
    }
    userConnections[userId].push(socket.id);
  });

  socket.on('sendMessage', (message) => {
    io.to(message.receiverId.toString()).emit('receiveMessage', message);
  });

  socket.on('joinRoom', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);

    const userId = Object.keys(userConnections).find(id => userConnections[id].includes(socket.id));
    if (userId) {
      if (!userRooms[userId]) {
        userRooms[userId] = [];
      }
      userRooms[userId].push(room);
    }
  });

  socket.on('camperJoined', async (campOfferId, userId) => {
    try {
      // Retrieve the camp offer details
      const offer = await prisma.campingPost.findUnique({
        where: { id: campOfferId },
        select: { title: true, organizerId: true },
      });
  
      // Retrieve the camper details
      const camper = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });
  
      // Check if the offer and camper exist
      if (!offer || !camper) {
        console.log(`Camp offer with ID ${campOfferId} or camper with ID ${userId} not found.`);
        return;
      }
  
      // Create the notification message
      const notificationMessage = `${camper.name} has joined your camp offer titled ${offer.title}`;
      console.log(`User (Name: ${camper.name}) has joined your camp offer titled "${offer.title}" (Offer ID: ${campOfferId})`);
  
      // Send the notification to the organizer
      io.to(offer.organizerId.toString()).emit('notification', notificationMessage);
      console.log(notificationMessage);
  
      // Check if a record already exists
      const existingNotification = await prisma.joinCampingPost.findUnique({
        where: {
          userId_postId: {
            userId: userId,
            postId: campOfferId,
          },
        },
      });
  
      if (existingNotification) {
        // Update the existing record
        await prisma.joinCampingPost.update({
          where: {
            userId_postId: {
              userId: userId,
              postId: campOfferId,
            },
          },
          data: {
            notification: notificationMessage,
            status: 'PENDING', // Update status or any other fields as needed
          },
        });
      } else {
        // Create a new record if not found
        await prisma.joinCampingPost.create({
          data: {
            userId: userId,
            postId: campOfferId,
            rating: 0, // Default rating or use actual rating if available
            reviews: '', // Default reviews or use actual reviews if available
            favorite: 'No', // Default favorite status
            notification: notificationMessage,
            status: 'PENDING', // Default status or use actual status if available
          },
        });
      }
  
    } catch (error) {
      console.error('Error processing camperJoined event:', error);
    }
  });
  



  socket.on('disconnect', () => {
    console.log('User disconnected');

    for (const userId in userConnections) {
      const index = userConnections[userId].indexOf(socket.id);
      if (index !== -1) {
        userConnections[userId].splice(index, 1);
        if (userConnections[userId].length === 0) {
          delete userConnections[userId];
          delete userRooms[userId];
        }
        break;
      }
    }
  });

  socket.on('error', (err) => {
    console.error('Socket.IO error:', err);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Passport initialization
app.use(passport.initialize());
require('./security/passport')(passport);

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/camps', campsRoutes);
app.use('/api/joinPosts', joinPostRoutes);
app.use('/api/acceptAndReject', joiningRequestRoutes);
app.use('/api/experienceTip', experienceRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/like', likeRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/dashboard',dashboardRoutes)

// Test route to verify Socket.IO initialization
app.get('/test', (req, res) => {
  if (io) {
    res.send('Socket.IO is initialized');
  } else {
    res.status(500).send('Socket.IO is not initialized');
  }
});

// Start server
const port = 5000;
server.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});





