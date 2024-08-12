const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new share
const createShare = async (req, res) => {
  try {
    const { userId, experienceId } = req.body;

    // Create a new share record
    const share = await prisma.share.create({
      data: {
        user: { connect: { id: userId } },
        experience: { connect: { id: experienceId } },
      },
    });

    // Increment the share counter on the experience
    await prisma.experiencesTips.update({
      where: { id: experienceId },
      data: { shareCounter: { increment: 1 } },
    });

    res.status(201).json(share);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while sharing the experience.' });
  }
};

// Get all shared experiences for a user
const getSharedExperiences = async (req, res) => {
  try {
    const { userId } = req.params;

    // Retrieve all shares for the user
    const sharedExperiences = await prisma.share.findMany({
      where: { userId: parseInt(userId) },
      include: {
        experience: {
          include: {
            user: true,
            likes: true,
            comments: true,
            shares: true,
          },
        },
      },
    });

    res.status(200).json(sharedExperiences);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving shared experiences.' });
  }
};

module.exports = {
  createShare,
  getSharedExperiences,
};
