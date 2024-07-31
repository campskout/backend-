const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new experience
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
        likeCounter: 0,
        shareCounter: 0
      },
    });

    res.status(201).json(newExperience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while creating the experience.' });
  }
};

// Get an experience by ID with comments, likes, and shares
// const getExperienceById = async (req, res) => {
//     try {
//       const { id } = req.params;
  
//       const experience = await prisma.experiencesTips.findUnique({
//         where: { id: parseInt(id, 10) },
//         include: {
//           user: true, // Include the user who created the experience
//           comments: true, // Include comments related to the experience
//           likes: true, // Include likes related to the experience
//           shares: true // Include shares related to the experience
//         }
//       });
  
//       if (!experience) {
//         return res.status(404).json({ error: 'Experience not found.' });
//       }
  
//       res.status(200).json(experience);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Something went wrong while fetching the experience.' });
//     }
//   };

//
  

// Controller to get all experiences along with their creators
const getAllExperiences = async (req, res) => {
    try {
      // Fetch all experiences including the user who created each experience
      const experiences = await prisma.experiencesTips.findMany({
        include: {
          user: true, // Include the user who created the experience
          comments: true, // Optionally include comments related to the experience
          likes: true, // Optionally include likes related to the experience
          shares: true // Optionally include shares related to the experience
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
  //getExperienceById
  getAllExperiences
};
