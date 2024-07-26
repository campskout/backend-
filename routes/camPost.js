const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ROLES, inRole } = require('../security/Rolemiddleware');

const {fetchCampings,createPost}= require('../controllers/camPost')

router.get('/getAll',fetchCampings)
router.post('/add',createPost)

module.exports = router;