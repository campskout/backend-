
const express = require('express');
const { createExperience,getAllExperiences,getExperienceById} = require('../controllers/experience');
const router = express.Router();

router.post('/add', createExperience);
router.get('/:id', getExperienceById)
router.get('/all/get', getAllExperiences);



module.exports = router;
