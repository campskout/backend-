const express = require('express');
const { createShare, getSharedExperiences } = require('../controllers/share');
const router = express.Router();

// Create a new share
router.post('/add', createShare);

// Get all shared experiences for a user
router.get('/all/:userId', getSharedExperiences);

module.exports = router;
