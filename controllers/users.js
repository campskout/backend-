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

const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id, 10);

    // Ensure userId is a valid number
    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    try {
        // Fetch the user and their camping posts including users who joined the posts
        const userWithPosts = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                posts: {
                    include: {
                        joinCampingPosts: {
                            include: {
                                user: true, // Include the users who joined the camping post
                                post: true // Include the camping post details
                            },
                        },
                    },
                },
            },
        });

        if (!userWithPosts) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare an object to hold the posts, the users who joined them, and reviews/ratings
        const postUsers = userWithPosts.posts.map(post => {
            const joinedUsers = post.joinCampingPosts
                .filter(join => join.userId !== userId) // Exclude the original user
                .map(join => ({
                    user: join.user,
                    rating: join.rating, // Add rating
                    review: join.review // Add review
                })); // Map to user objects with ratings/reviews

            return {
                post,
                joinedUsers,
            };
        });

        // Respond with the user data and the joined users for each post
        res.json({
            user: userWithPosts,
            posts: postUsers, // Contains posts and their joined users with reviews/ratings
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};





module.exports = {
    fetchUsers,
    updateUserInterests,
    getUserById 
};
