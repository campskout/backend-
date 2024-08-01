const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create experience
const createExperience = async (req, res) => {
  try {
    const { title, content, imagesUrl, location, category, filterCategory, userId } = req.body;

    // Validate required fields
    if (!title || !content || !location || !category || !userId || !filterCategory) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newExperience = await prisma.experiencesTips.create({
      data: {
        title,
        content,
        imagesUrl,
        location,
        category,
        filterCategory,
        user: {
          connect: { id: userId }
        },
        likeCounter: 0,  // Initial value for likeCounter
        shareCounter: 0,  // Initial value for shareCounter
      },
    });

    res.status(201).json(newExperience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the experience.' });
  }
};

// Get experience by ID with comments, likes, and shares
const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the id is parsed as an integer
    const experienceId = parseInt(id, 10);

    // Validate if experienceId is a number
    if (isNaN(experienceId)) {
      return res.status(400).json({ error: 'Invalid experience ID.' });
    }

    const experience = await prisma.experiencesTips.findUnique({
      where: { id: experienceId },
      include: {
        user: true, // Include the user who created the experience
        comments: {
          include: {
            user: true, // Include the user who commented
          }
        },
        likes: {
          include: {
            user: true, // Include the user who liked
          }
        },
        shares: {
          include: {
            user: true, // Include the user who shared
          }
        }
      }
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found.' });
    }

    res.status(200).json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching the experience.' });
  }
};

// Get all experiences along with their creators
const getAllExperiences = async (req, res) => {
  try {
    // Fetch all experiences including the user who created each experience
    const experiences = await prisma.experiencesTips.findMany({
      include: {
        user: true, // Include the user who created the experience
        comments: {
          include: {
            user: true, // Include the user who commented
          }
        },
        likes: {
          include: {
            user: true, // Include the user who liked
          }
        },
        shares: {
          include: {
            user: true, // Include the user who shared
          }
        }
      }
    });

    res.status(200).json(experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching experiences.' });
  }
};

module.exports = {
  createExperience,
  getExperienceById,
  getAllExperiences
};
