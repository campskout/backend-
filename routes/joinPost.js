const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ROLES, inRole } = require('../security/Rolemiddleware');

const {fetchJoinPosts,createJoinPostCamping,cancelJoinPostCamping,fetchOnePostJoin}= require('../controllers/joinCamping.js')

router.get('/get',fetchJoinPosts)
router.post('/add',createJoinPostCamping)
router.post('/cancel',cancelJoinPostCamping)
router.get('/:userId/:postId', fetchOnePostJoin);

module.exports = router;