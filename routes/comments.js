const express = require('express');
const router = express.Router();
const { createComment, getCommentsForExperience,deleteComments } = require('../controllers/comment');

router.post('/add', createComment);
router.get('/:experienceId/comments', getCommentsForExperience);
router.delete('/:id',deleteComments)


module.exports = router;
