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

const getUserById = async (req, res) => {
    const userId = req.params.id;

    // Ensure userId is a valid number
    if (!Number(userId) || Number(userId) <= 0) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        // Fetch the user and their camping posts
        const userWithPosts = await prisma.user.findUnique({
            where: { id: Number(userId) },
            include: {
                posts: {
                    include: {
                        joinCampingPosts: {
                            include: {
                                user: true, // Include the user who joined the camping post
                            },
                        },
                    },
                },
            },
        });

        if (!userWithPosts) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract posts
        const posts = userWithPosts.posts || [];

        // Prepare an object to hold the posts and the users who joined them
        const postUsers = {};

        // Iterate over each post and collect users who joined
        for (const post of posts) {
            const joinedUsers = post.joinCampingPosts
                .filter(join => join.userId !== Number(userId)) // Exclude the original user
                .map(join => join.user); // Map to user objects
            
            postUsers[post.id] = {
                post,
                joinedUsers,
            };
        }

        // Respond with the user data and the joined users for each post
        res.json({
            user: userWithPosts,
            posts: postUsers, // Contains posts and their joined users
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    fetchUsers,
    getUserById 
}