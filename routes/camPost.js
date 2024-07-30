const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ROLES, inRole } = require('../security/Rolemiddleware');
const {fetchCampings,createPost,campingPostDetails,onePostParticipants}= require('../controllers/camPost')

router.get('/getAll',fetchCampings)
router.post('/add',createPost)
router.get('/:id',campingPostDetails)
router.get("/participants/:id",onePostParticipants)
module.exports = router;