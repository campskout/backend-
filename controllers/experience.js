// experienceController.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createExperience = async (req, res) => {
  try {
    const { title, content, imagesUrl, location, category, filterCategory, userId } = req.body;

    const newExperience = await prisma.experiencesTips.create({
      data: {
        title,
        content,
        imagesUrl,
        location,
        category,
        filterCategory,
        userId,
        likeCounter: 0, // Initial like counter
        shareCounter: 0 // Initial share counter
      },
    });

    res.status(201).json(newExperience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while creating the experience.' });
  }
};

module.exports = {
  createExperience,
};
