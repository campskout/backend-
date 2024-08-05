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
const tipsRoutes = require('./routes/tips.js')
const app = express()
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
app.use('/api/tips', tipsRoutes);

const port = 5000

app.listen(port,()=>console.log(`App listening on port ${port}!`))

