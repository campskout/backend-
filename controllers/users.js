const prisma = require('../database/prisma.js')


const fetchUsers = async (req, res) => {
    const users = await prisma.user.findMany({
        include: {
            posts: true,
            joinCampingPosts:true
        },
        
        orderBy: {
            id: "desc",
        },
    });

    return res.json({ status: 200, data: users });
};


module.exports = {
    fetchUsers
}