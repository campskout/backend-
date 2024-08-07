const express = require('express')
const cors = require ('cors')
const usersRoutes = require ('./routes/user.js')
const campsRoutes= require ('./routes/camPost.js')
const joinPostRoutes = require('./routes/joinPost.js')
const experienceRoutes =require('./routes/experience.js')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const commentRoutes =require('./routes/comments.js')
const likeRoutes = require('./routes/like.js')
const joiningRequestRoutes =require('../backend-/routes/acceptAndReject.js')
const shareRoutes=require('./routes/share.js')
const http = require('http');
const { Server } = require('socket.io')
const ChatRoutes = require('./routes/ChatRoutes.js');
const app = express();
const authenticateToken = require('./controllers/authController.js').authenticateToken;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:["http://localhost:8081","http://localhost:5000","http//192.168.10.4:8081","exp://192.168.10.4:8081"]
    }
});
// * Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());
app.use(cors())

/* passport */
app.use(passport.initialize()) 
require('./security/passport')(passport)

app.use('/api/users',usersRoutes)
app.use('/api/camps',campsRoutes)
app.use('/api/joinPosts',joinPostRoutes)

app.use('/api/acceptAndReject', joiningRequestRoutes)
app.use('/api/experienceTip',experienceRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/like', likeRoutes)
app.use('/api/share', shareRoutes);
app.use('/api/chat', authenticateToken, ChatRoutes);
const userConnections = {}; 
const userRooms = {}; 


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Track the connected user's information
    socket.on('setUser', (userId) => {
        console.log(`User ${userId} connected with socket ID ${socket.id}`);
        if (!userConnections[userId]) {
            userConnections[userId] = [];
        }
        userConnections[userId].push(socket.id);
        userRooms[userId] = userRooms[userId] || [];
    });

    // Handle joining a room
    socket.on('joinRoom', (conversationId) => {
        console.log(`Socket ID ${socket.id} joined room: ${conversationId}`);
        socket.join(conversationId);

        // Track the room for the user
        const userId = Object.keys(userConnections).find(id => userConnections[id].includes(socket.id));
        if (userId) {
            userRooms[userId].push(conversationId);
        }
    });

    // Handle sending messages
    socket.on('sendMessage', async (messageData) => {
        const { senderId, receiverId, content, conversationId } = messageData;

        try {
            await prisma.chatMessage.create({
                data: {
                    content,
                    senderId,
                    receiverId,
                    conversationId,
                },
            });

            console.log(`Message from ${senderId} to ${receiverId} in room ${conversationId}: ${content}`);

            // Emit the new message to the receiver
            io.to(conversationId).emit('newMessage', messageData);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Socket ID ${socket.id} disconnected`);
    });
});

  const PORT = process.env.PORT || 5000;
  
  server.listen(PORT, () => { console.log(`Server listening on port ${PORT}`);});