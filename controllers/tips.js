const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const fetchTips = async (req, res) => {
  try {
    // Fetch all experiences with the category 'Tips'
    const tips = await prisma.experiencesTips.findMany({
      where: {
        category: 'Tips',
      },
    });

    if (!tips || tips.length === 0) {
      return res.status(404).json({ status: 404, message: 'No tips found' });
    }

    return res.json({ status: 200, data: tips });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 500, message: 'Internal Server Error' });
  }
};

module.exports = {
  fetchTips,
};
