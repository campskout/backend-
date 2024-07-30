const express = require('express');
const router = express.Router();
const {acceptRequest,rejectRequest} = require('../controllers/acceptAndReject');

// Route to accept a joining request
router.post('/:userId/:postId', acceptRequest);

// Route to reject a joining request
router.post('/reject/:userId/:postId', rejectRequest);

module.exports = router;
