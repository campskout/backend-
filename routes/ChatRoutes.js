const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/chatController');
const authenticateToken = require('../controllers/authController').authenticateToken;

router.use(authenticateToken);

// Get all conversations for a user
router.get('/conversations', ChatController.getConversations);

// Get messages for a specific conversation
router.get('/conversations/:conversationId/messages', ChatController.getMessages);

module.exports = router;
