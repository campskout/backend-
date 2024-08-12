const prisma = require('../database/prisma.js')

const fetchDataDashboard = async (req, res) => {
    try {
        // Fetch counts and latest camping posts
        const [totalViews, totalCampingPosts, campingPosts, totalUsers, totalExperiencesTips] = await Promise.all([
            prisma.experiencesTips.count(),  // Total number of experiences tips
            prisma.campingPost.count(),      // Total number of camping posts
            prisma.campingPost.findMany({
                take: 5,                    // Latest 5 camping posts
            }),
            prisma.user.count(),            // Total number of users
            prisma.experiencesTips.count()  // Total number of experiences tips
        ]);

        // Respond with all the fetched data
        res.json({ 
            totalViews, 
            totalCampingPosts,
            campingPosts, 
            totalUsers,
            totalExperiencesTips
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Failed to fetch dashboard data" });
    }
};

const chartOne = async(req,res) =>{
    try {
        const userStats = await prisma.user.count();
        const campingPostsCount = await prisma.campingPost.count();
        
        // You can fetch other statistics or data points here
        
        res.status(200).json({ userStats, campingPostsCount });
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
 };

const chartTwo = async(req,res)=>{
    try {
        const campingPosts = await prisma.campingPost.findMany({
          select: {
            title: true,
            startDate: true,
            endDate: true,
          },
        });
    
        // Example of transforming data for the chart
        const transformedData = campingPosts.map(post => ({
          title: post.title,
          duration: Math.floor((new Date(post.endDate).getTime() - new Date(post.startDate).getTime()) / (1000 * 60 * 60 * 24)),
        }));
    
        res.status(200).json(transformedData);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
      }
 };

const chartThree = async(req,res)=>{
    const campingPosts = await prisma.campingPost.groupBy({
        by: ['category'],
        _count: {
          id: true,
        },
      });
    
      // Convert the result to a format suitable for the chart
      const data = campingPosts.map((post) => ({
        category: post.category,
        count: post._count.id,
      }));
    
      res.json(data);
 };

const EndpointTofetchCampingPostLocations = async(req,res)=>{
    try {
        const campingPosts = await prisma.campingPost.findMany({
          select: {
            id: true,
            title: true,
            location: true,
            startDate: true,
            endDate: true,
          },
        });
    
        // Format data for the map
        const data = campingPosts.map(post => ({
          id: post.id,
          title: post.title,
          location: post.location,
          startDate: post.startDate,
          endDate: post.endDate,
        }));
    
        res.json(data);
      } catch (error) {
        console.error("Error fetching camping posts:", error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
};


module.exports = {
    fetchDataDashboard, 
    chartOne,
    chartTwo,
    chartThree,
    EndpointTofetchCampingPostLocations
}