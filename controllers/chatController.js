const prisma = require('../database/prisma.js');



const sendMessage = async (req, res) => {
    const { conversationId, senderId, content } = req.body;
  
    if (!conversationId || !senderId || !content) {
      return res.status(400).json({ status: 400, message: 'All fields are required' });
    }
  
    try {
      const message = await prisma.chatMessage.create({
        data: {
          conversationId,
          senderId,
          content,
        },
      });
  
      res.json({ status: 200, data: message });
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
  };
  const getMessages = async (req, res) => {
    const { user1Id, user2Id } = req.params;

    if (!user1Id || !user2Id) {
        return res.status(400).json({ status: 400, message: 'User IDs are required' });
    }

    try {
        const messages = await prisma.chatMessage.findMany({
            where: {
                OR: [
                    { senderId: Number(user1Id), receiverId: Number(user2Id) },
                    { senderId: Number(user2Id), receiverId: Number(user1Id) },
                ],
            },
            orderBy: { createdAt: 'asc' },
        });

        res.json({ status: 200, data: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};





  module.exports={
    sendMessage,
    getMessages    
  }