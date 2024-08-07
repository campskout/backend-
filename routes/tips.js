const express = require('express');
const router = express.Router();
const {fetchTips} = require('../controllers/tips');

router.get('/getTip',fetchTips );

module.exports = router;
