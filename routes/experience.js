
const express = require('express');
const { createExperience,getAllExperiences} = require('../controllers/experience');
const router = express.Router();

router.post('/add', createExperience);
//router.get('/:id', getExperienceById)
router.get('/get', getAllExperiences);



module.exports = router;
