
const express = require('express');
const { createExperience,getAllExperiences,getExperienceById,deleteExperience} = require('../controllers/experience');
const router = express.Router();

router.post('/add', createExperience);
router.get('/:id', getExperienceById)
router.get('/all/get', getAllExperiences);
router.delete('/:id',deleteExperience)



module.exports = router;
