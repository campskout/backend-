const prisma = require('../database/prisma.js')


const fetchJoinPosts = async (req, res) => {
    const users = await prisma.joinCampingPost.findMany({
        include: {
        user: true,
        post:true
        },   
    });
    return res.json({ status: 200, data: users });
};

const createJoinPostCamping = async (req, res) => {
    const { userId, postId, rating, reviews, favorite, notification } = req.body;

    try {
        // Check if the user and post exist
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const post = await prisma.campingPost.findUnique({ where: { id: postId } });

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        if (!post) {
            return res.status(404).json({ status: 404, message: 'Post not found' });
        }

        // Check if the JoinCampingPost entry already exists
        const existingJoinCampingPost = await prisma.joinCampingPost.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        if (existingJoinCampingPost) {
            return res.status(409).json({ status: 409, message: 'JoinCampingPost entry already exists' });
        }

        // Create the JoinCampingPost entry
        const newJoinCampingPost = await prisma.joinCampingPost.create({
            data: {
                userId,
                postId,
                rating,
                reviews,
                favorite,
                notification
            }
        });

        return res.json({ status: 200, data: newJoinCampingPost, msg: 'JoinCampingPost created successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

const cancelJoinPostCamping = async (req, res) => {
    const { userId, postId } = req.body;

    try {
        // Check if the JoinCampingPost entry exists
        const existingJoinCampingPost = await prisma.joinCampingPost.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        if (!existingJoinCampingPost) {
            return res.status(404).json({ status: 404, message: 'JoinCampingPost entry not found' });
        }

        // Delete the JoinCampingPost entry
        await prisma.joinCampingPost.delete({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        return res.json({ status: 200, message: 'JoinCampingPost entry successfully canceled' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

const fetchOnePostJoin = async (req, res) => {
    const { userId, postId } = req.params; // Retrieve parameters from the request

    try {
        // Fetch a single JoinCampingPost entry by userId and postId
        const joinCampingPost = await prisma.joinCampingPost.findUnique({
            where: {
                userId_postId: {
                    userId: parseInt(userId, 10),
                    postId: parseInt(postId, 10)
                }
            },
            include: {
                user: true,
                post: true
            }
        });

        if (!joinCampingPost) {
            return res.status(404).json({ status: 404, message: 'JoinCampingPost entry not found' });
        }

        return res.json({ status: 200, data: joinCampingPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

module.exports = {
    fetchJoinPosts,
    createJoinPostCamping,
    cancelJoinPostCamping,
    fetchOnePostJoin
}