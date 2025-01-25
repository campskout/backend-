const express = require('express');
const router = express.Router();

const {emailVerifications,verifyEmail} = require('../controllers/googleAuth.js')

router.post('/request-verification',emailVerifications)
router.get('/verify-email',verifyEmail)


module.exports = router;