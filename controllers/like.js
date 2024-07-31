const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const likeExperience = async (req, res) => {
  const experienceId = Number(req.params.experienceId);
  const userId = Number(req.body.userId);

  try {
    // Check if the like already exists
    const existingLikes = await prisma.like.findMany({
      where: {
        experienceId,
        userId,
      },
      take: 1,
    });

    if (existingLikes.length > 0) {
      // Unlike the experience
      await prisma.like.delete({
        where: {
          id: existingLikes[0].id,
        },
      });

      // Optionally, update likeCounter in ExperiencesTips
      await prisma.experiencesTips.update({
        where: { id: experienceId },
        data: { likeCounter: { decrement: 1 } },
      });

      return res.status(200).json({ message: 'Experience unliked successfully' });
    } else {
      // Like the experience
      const like = await prisma.like.create({
        data: {
          experienceId,
          userId,
        },
      });

      // Optionally, update likeCounter in ExperiencesTips
      await prisma.experiencesTips.update({
        where: { id: experienceId },
        data: { likeCounter: { increment: 1 } },
      });

      return res.status(201).json(like);
    }
  } catch (error) {
    console.error('Error liking/unliking experience:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const unlikeExperience = async (req, res) => {
  const experienceId = Number(req.params.experienceId);
  const userId = Number(req.body.userId);

  try {
    // Check if the like exists
    const existingLikes = await prisma.like.findMany({
      where: {
        experienceId,
        userId,
      },
      take: 1,
    });

    if (existingLikes.length === 0) {
      return res.status(400).json({ message: 'Like not found' });
    }

    // Delete the like
    await prisma.like.delete({
      where: {
        id: existingLikes[0].id,
      },
    });

    // Optionally, update likeCounter in ExperiencesTips
    await prisma.experiencesTips.update({
      where: { id: experienceId },
      data: { likeCounter: { decrement: 1 } },
    });

    return res.status(200).json({ message: 'Experience unliked successfully' });
  } catch (error) {
    console.error('Error unliking experience:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  likeExperience,
  unlikeExperience,
};
