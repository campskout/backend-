
const express = require('express');
const { createExperience } = require('../controllers/experience');
const router = express.Router();

router.post('/add', createExperience);




module.exports = router;
