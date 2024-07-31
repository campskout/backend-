const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new comment for an experience
const createComment = async (req, res) => {
  try {
    const { content, experienceId } = req.body;

    const newComment = await prisma.comments.create({
      data: {
        content,
        experienceId,
      },
    });

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while creating the comment.' });
  }
};

// Get all comments for a specific experience
const getCommentsForExperience = async (req, res) => {
  try {
    const { experienceId } = req.params;

    const comments = await prisma.comments.findMany({
      where: { experienceId: parseInt(experienceId) },
      include: { experience: true }, // Include experience information with the comment
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching comments.' });
  }
};

//get the experience by id :

// Get an experience by ID with comments, likes, shares, and user related to each comment
// Get an experience by ID with comments, likes, shares, and user related to each comment
const getExperienceById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Fetch the experience with its comments, likes, and shares
      const experience = await prisma.experiencesTips.findUnique({
        where: { id: parseInt(id, 10) },
        include: {
          user: true, // Include the user who created the experience
          comments: true, // Include comments related to the experience
          likes: true, // Include likes related to the experience
          shares: true // Include shares related to the experience
        }
      });
  
      if (!experience) {
        return res.status(404).json({ error: 'Experience not found.' });
      }
  
      // Fetch the user related to each comment
      const commentsWithUsers = await Promise.all(
        experience.comments.map(async (comment) => {
          const commentUser = await prisma.user.findFirst({
            where: {
              experiences: {
                some: {
                  comments: {
                    some: { id: comment.id }
                  }
                }
              }
            }
          });
          return { ...comment, user: commentUser };
        })
      );
  
      // Replace the comments with the comments including the user data
      experience.comments = commentsWithUsers;
  
      res.status(200).json(experience);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong while fetching the experience.' });
    }
  };

module.exports = {
  createComment,
  getCommentsForExperience,
  getExperienceById
};
