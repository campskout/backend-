const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getConversations = async (req, res) => {
  const userId = req.user.id;
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: { id: userId }
        }
      },
      include: {
        messages: true,
        participants: true
      }
    });
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch conversations' });
  }
};

exports.getMessages = async (req, res) => {
  const { conversationId } = req.params;
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId: Number(conversationId) },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch messages' });
  }
};
