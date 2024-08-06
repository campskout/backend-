// src/routes/invitationRoutes.js
const express = require('express');
const {
  sendInvitation,
  respondToInvitation,
  getSentInvitations,
  getReceivedInvitations,
} = require('../controllers/invitations');

const router = express.Router();

router.post('/send', sendInvitation);
router.post('/respond', respondToInvitation);
router.get('/sent/:senderId', getSentInvitations);
router.get('/received/:receiverId', getReceivedInvitations);

module.exports = router;
