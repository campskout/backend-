// src/routes/invitationRoutes.js
const express = require('express');
const {
  sendInvitation,
  respondToInvitation,
  getSentInvitations,
  getReceivedInvitations,
  getInvitationStatus} = require('../controllers/invitations');

const router = express.Router();

router.post('/send', sendInvitation);
router.post('/respond', respondToInvitation);
router.get('/sent/:senderId', getSentInvitations);
router.get('/received/:receiverId', getReceivedInvitations);
router.get('/status', getInvitationStatus);


module.exports = router;
