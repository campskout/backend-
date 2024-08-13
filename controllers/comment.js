const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new comment for an experience
const createComment = async (req, res) => {
  try {
    const { content, experienceId, userId } = req.body;

    const newComment = await prisma.comments.create({
      data: {
        content,
        experienceId,
        userId, // Add userId to associate the comment with the user
      },
    });0

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
      include: { 
        user: true, // Include user information with the comment
        experience: true, // Include experience information with the comment
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching comments.' });
  }
};

//delete Comments
const deleteComments = async (req, res) => {
  const { id } = req.params;

  try {
    if (isNaN(parseInt(id, 10))) {
      return res.status(400).json({ error: 'Invalid comment ID' });
    }

    await prisma.comments.delete({
      where: { id: parseInt(id, 10) },
    });

    res.status(200).json({ message: `Comment with ID ${id} has been deleted successfully.` });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
}

module.exports = {
  createComment,
  getCommentsForExperience,
  deleteComments
};
