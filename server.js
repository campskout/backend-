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
const invitationRoutes = require('./routes/invitations.js');
const http = require('http');
const app = express();


const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5000/', 
    methods: ['GET', 'POST'],
  },
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
app.use('/api/invitations', invitationRoutes)

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle incoming messages
    socket.on('sendMessage', (message) => {
        // Broadcast the message to the receiver
        io.to(message.receiverId).emit('receiveMessage', message);
    });

    // Handle user joining a room
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});



const port = 5000

app.listen(port,()=>console.log(`App listening on port ${port}!`))

