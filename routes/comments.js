const express = require('express');
const router = express.Router();
const { createComment, getCommentsForExperience } = require('../controllers/comment');

router.post('/add', createComment);
router.get('/:experienceId/comments', getCommentsForExperience);


module.exports = router;
