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
        images } = req.body;

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
                    include: {
                        user: true, // Optionally include user details in joinCampingPosts
                        post:true
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

module.exports = {
    fetchCampings,
    createPost,
    campingPostDetails
    
}