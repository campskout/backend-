const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ROLES, inRole } = require('../security/Rolemiddleware');
const {fetchCampings,createPost,campingPostDetails,onePostParticipants,updateReview}= require('../controllers/camPost')

router.get('/getAll',fetchCampings)
router.post('/add',createPost)
router.get('/:id',campingPostDetails)
router.get("/participants/:id",onePostParticipants)
router.post('/updateReview', updateReview);

module.exports = router;