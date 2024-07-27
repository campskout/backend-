const prisma = require('../database/prisma.js')


const fetchUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            
            include: {
                posts: true, // Assuming this is a relation to another model named 'Post'
                joinCampingPosts: {
                    include: {
                        post: true, // To include the associated CampingPost
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



module.exports = {
    fetchUsers
}