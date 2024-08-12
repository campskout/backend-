const prisma = require('../database/prisma.js')

const { notifyUser } = require('../notificationService.js'); // Import notifyUser

const fetchJoinPosts = async (req, res) => {
    const users = await prisma.joinCampingPost.findMany({
        include: {
            user: true,
            post: true
        },
    });
    return res.json({ status: 200, data: users });
};

const createJoinPostCamping = async (req, res) => {
    const { userId, postId, rating, reviews, favorite, notification, status } = req.body;

    try {
        // Your logic here
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const post = await prisma.campingPost.findUnique({ where: { id: postId } });

        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        if (!post) {
            return res.status(404).json({ status: 404, message: 'Post not found' });
        }

        if (status === 'ACCEPTED' && post.places <= 0) {
            return res.status(400).json({ status: 400, message: 'No available places left' });
        }

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

        const newJoinCampingPost = await prisma.joinCampingPost.create({
            data: {
                userId,
                postId,
                rating,
                reviews,
                favorite,
                notification,
                status
            }
        });

        if (status === 'ACCEPTED') {
            const updatedPost = await prisma.campingPost.update({
                where: { id: postId },
                data: { places: post.places - 1 }
            });

            return res.json({ status: 200, data: newJoinCampingPost, msg: 'JoinCampingPost created successfully.', updatedPost });
        } else {
            return res.json({ status: 200, data: newJoinCampingPost, msg: 'JoinCampingPost created successfully.' });
        }
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

        // Increment the post's available places
        const post = await prisma.campingPost.findUnique({ where: { id: postId } });

        if (post) {
            await prisma.campingPost.update({
                where: { id: postId },
                data: { places: post.places + 1 }
            });
        }

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
                    postId: parseInt(postId, 10),

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

async function getOfferCreatorId(campOfferId) {
    try {
      // Fetch the camp offer details from the database
      const offer = await prisma.campingPost.findUnique({
        where: {
          id: campOfferId,
        },
        select: {
          organizerId: true,
        },
      });
  
      // Check if the offer exists and return the organizer ID
      if (offer) {
        return offer.organizerId;
      } else {
        console.log(`Camp offer with ID ${campOfferId} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching offer creator ID:', error);
      throw new Error('Error fetching offer creator ID');
    }
  }


module.exports = {
    fetchJoinPosts,
    createJoinPostCamping,
    cancelJoinPostCamping,
    fetchOnePostJoin,
    getOfferCreatorId
}