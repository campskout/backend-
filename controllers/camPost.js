const prisma = require('../database/prisma.js')


const fetchCampings = async (req, res) => {
    const campings = await prisma.campingPost.findMany({
        include: {
         user:true
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
module.exports = {
    fetchCampings,
    createPost
}