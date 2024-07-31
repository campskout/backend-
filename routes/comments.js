const express = require('express');
const router = express.Router();
const { createComment, getCommentsForExperience } = require('../controllers/comment');

// Assuming you have a middleware to authenticate users

router.post('/add', createComment);
router.get('/:experienceId', getCommentsForExperience);

module.exports = router;
