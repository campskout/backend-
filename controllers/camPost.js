const prisma = require('../database/prisma.js')


const fetchCampings = async (req, res) => {
    const campings = await prisma.campingPost.findMany({
        include: {
         user:true,
         joinCampingPosts: {
            include: {
                post: true, // To include the associated CampingPost
                user:true
            }
        }, 
        },
        orderBy: {
            id: "desc",
          },
    });
    return res.json({ status: 200, data: campings });
};


const createPost = async (req, res) => {
    const { organizerId, title, description, location,
        startDate,
        endDate,
        equipment,
        places,
        ageCategory,
        images,category } = req.body;

    const newPost = await prisma.campingPost.create({
        data: {
            organizerId: Number(organizerId),
            title,
            description,
            location,
            startDate,
            endDate,
            equipment,
            places,
            ageCategory,
            images,
            category,
        },
    });

    return res.json({ status: 200, data: newPost, msg: "Post created." });
};


const campingPostDetails = async (req, res) => {
    const { id } = req.params; // Retrieve the ID from the request parameters

    try {
        // Fetch a single CampingPost entry by its ID
        const campingPost = await prisma.campingPost.findUnique({
            where: {
                id: parseInt(id, 10) // Convert ID to integer
            },
            include: {
                user: true,
                joinCampingPosts: {
                    where: {
                        status: 'ACCEPTED' // Filter joinCampingPosts with status "ACCEPTED"
                    },
                    include: {
                        user: true // Optionally include user details in joinCampingPosts
                    }
                }
            }
        });

        if (!campingPost) {
            return res.status(404).json({ status: 404, message: 'CampingPost not found' });
        }

        return res.json({ status: 200, data: campingPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

const onePostParticipants = async (req, res) => {
    const { id } = req.params; // Retrieve the ID from the request parameters

    try {
        // Fetch a single CampingPost entry by its ID
        const campingPost = await prisma.campingPost.findUnique({
            where: {
                id: parseInt(id, 10) // Convert ID to integer
            },
            include: {
                user: true,
                joinCampingPosts: {
                    include: {
                        user: true // Optionally include user details in joinCampingPosts
                    }
                }
            }
        });

        if (!campingPost) {
            return res.status(404).json({ status: 404, message: 'CampingPost not found' });
        }

        return res.json({ status: 200, data: campingPost });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};

const updateReview = async (req, res) => {
    const { postId, userId, rating, reviews } = req.body;

    // Validate the input
    if (typeof rating !== 'number' || typeof reviews !== 'string' || !postId || !userId) {
        return res.status(400).json({ status: 400, message: 'Invalid input' });
    }

    try {
        // Log the input data for debugging
        console.log('Updating review with:', { postId, userId, rating, reviews });

        // Update the review in the JoinCampingPost table
        const updatedJoin = await prisma.joinCampingPost.update({
            where: {
                userId_postId: {
                    userId: Number(userId),
                    postId: Number(postId),
                },
            },
            data: {
                rating,
                reviews,
            },
        });

        // Return a success response
        return res.json({ status: 200, data: updatedJoin, msg: "Review updated successfully." });
    } catch (error) {
        // Log and return the error
        console.error('Error updating review:', error);
        return res.status(500).json({ status: 500, message: 'Internal Server Error' });
    }
};


module.exports = {
    fetchCampings,
    createPost,
    campingPostDetails,
    onePostParticipants,
    updateReview
}
