const express = require('express');
const router = express.Router();
const {likeExperience,unlikeExperience} = require('../controllers/like');

// Route to handle adding a like
// Like a post
router.post('/:experienceId/like', likeExperience);

// Unlike a post
router.delete('/:experienceId/like', unlikeExperience);

module.exports = router;
