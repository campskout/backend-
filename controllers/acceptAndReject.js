const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller to accept a joining request
exports.acceptRequest = async (req, res) => {
  const { userId, postId } = req.params;
  
  try {
    const request = await prisma.joinCampingPost.update({
      where: { userId_postId: { userId: parseInt(userId), postId: parseInt(postId) } },
      data: { status: 'ACCEPTED' }
    });
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
};

// Controller to reject a joining request
exports.rejectRequest = async (req, res) => {
  const { userId, postId } = req.params;
  
  try {
    const request = await prisma.joinCampingPost.update({
      where: { userId_postId: { userId: parseInt(userId), postId: parseInt(postId) } },
      data: { status: 'REJECTED' }
    });
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reject request' });
  }
};
