const express = require('express');
const router = express.Router();
const { likeExperience, unlikeExperience } = require('../controllers/like');

// Route to like an experience
router.post('/:experienceId/like', likeExperience);

// Route to unlike an experience
router.delete('/:experienceId/unlike', unlikeExperience);

module.exports = router;
