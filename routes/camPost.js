const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ROLES, inRole } = require('../security/Rolemiddleware');

const {fetchCampings,createPost,campingPostDetails}= require('../controllers/camPost')

router.get('/getAll',fetchCampings)
router.post('/add',createPost)
router.get('/:id',campingPostDetails)

module.exports = router;