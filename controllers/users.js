const prisma = require('../database/prisma.js');

const fetchUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: {
                posts: true,
                joinCampingPosts: {
                    include: {
                        post: true,
                    }
                },
            },
            orderBy: {
                id: "desc",
            },
        });

        return res.json({ status: 200, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

const updateUserInterests = async (req, res) => {
    const { userId, interests } = req.body;

    if (!userId || !Array.isArray(interests) || !interests.every(i => typeof i === 'string')) {
        return res.status(400).json({ status: 400, message: 'Invalid input' });
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { interests: interests },
        });

        return res.json({ status: 200, data: updatedUser });
    } catch (error) {
        console.error('Error updating user interests:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

module.exports = {
    fetchUsers,
    updateUserInterests,
};
