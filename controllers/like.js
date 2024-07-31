const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Like an experience
const likeExperience = async (req, res) => {
  const { experienceId } = req.params;
  const { userId } = req.body;

  try {
    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the experience exists
    const experienceExists = await prisma.experiencesTips.findUnique({
      where: { id: parseInt(experienceId) },
    });

    if (!experienceExists) {
      return res.status(404).json({ message: 'Experience not found.' });
    }

    // Check if the user has already liked the experience
    const existingLike = await prisma.like.findFirst({
      where: {
        experienceId: parseInt(experienceId),
        userId: parseInt(userId),
      },
    });

    if (existingLike) {
      return res.status(400).json({ message: 'You have already liked this experience.' });
    }

    // Create a new like
    await prisma.like.create({
      data: {
        experienceId: parseInt(experienceId),
        userId: parseInt(userId),
      },
    });

    // Increment like counter for the experience
    await prisma.experiencesTips.update({
      where: { id: parseInt(experienceId) },
      data: { likeCounter: { increment: 1 } },
    });

    res.status(200).json({ message: 'Experience liked successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while liking the experience.' });
  }
};

// Unlike an experience
const unlikeExperience = async (req, res) => {
  const { experienceId } = req.params;
  const { userId } = req.body;

  try {
    // Check if the user exists
    const userExists = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!userExists) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Check if the experience exists
    const experienceExists = await prisma.experiencesTips.findUnique({
      where: { id: parseInt(experienceId) },
    });

    if (!experienceExists) {
      return res.status(404).json({ message: 'Experience not found.' });
    }

    // Find and delete the like record
    await prisma.like.delete({
      where: {
        experienceId_userId: {
          experienceId: parseInt(experienceId),
          userId: parseInt(userId),
        },
      },
    });

    // Decrement like counter for the experience
    await prisma.experiencesTips.update({
      where: { id: parseInt(experienceId) },
      data: { likeCounter: { decrement: 1 } },
    });

    res.status(200).json({ message: 'Experience unliked successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while unliking the experience.' });
  }
};

module.exports = {
  likeExperience,
  unlikeExperience,
};
