const formidable = require('formidable');
const admin = require('firebase-admin');
const prisma = require('../database/prisma.js');
const path = require('path');
const fs = require('fs');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "creat-5d81c.appspot.com" // Replace with your actual bucket name
});

const bucket = admin.storage().bucket();

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Method to create a new camping post
const createPost = async (req, res) => {
  const form = new formidable.IncomingForm({
    uploadDir: uploadDir, // Directory to store uploaded files temporarily
    keepExtensions: true, // Keep file extensions
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
console.log(fields, files)
    try {
      // Access the files from the files object
      const fileArray = Array.isArray(files.images) ? files.images : [files.images]; // Handle single or multiple files

      if (!fileArray || fileArray.length === 0) {
        return res.status(400).json({ success: false, error: 'No image files provided' });
      }

      // Process each image and get their URLs
    //   console.log(fileArray);
      const imageUrls = await Promise.all(fileArray.map(async (file) => {
        const filePath = file.filepath; // Path to the temporary file
        const timestamp = Date.now(); // Optional: for unique file names
        const remoteFilePath = `uploads/images/${timestamp}-${file.originalFilename}`;

        // Upload the image using the bucket.upload() function
        await bucket.upload(filePath, { destination: remoteFilePath });

        // Options for the getSignedUrl() function
        const options = {
          action: 'read',
          expires: Date.now() + 24 * 60 * 60 * 1000 // 1 day
        };

        // Generate a signed URL for the uploaded file
        const [signedUrl] = await bucket.file(remoteFilePath).getSignedUrl(options);
        return signedUrl; // Return the signed URL
      }));

      // Extract the rest of the fields
      const { organizerId, title, description, location, startDate, endDate, equipment, places, ageCategory,category,status } = fields;

      // Create the new camping post with the image URLs
      const newPost = await prisma.campingPost.create({
        data: {
          organizerId: Number(organizerId),
          title: Array.isArray(title) ? title[0] : title,
          description: Array.isArray(description) ? description[0] : description,
          location: Array.isArray(location) ? location[0] : location,
          startDate: new Date(Array.isArray(startDate) ? startDate[0] : startDate),
          endDate: new Date(Array.isArray(endDate) ? endDate[0] : endDate),
          equipment,
          places: Number(places),
          ageCategory: Array.isArray(ageCategory) ? ageCategory[0] : ageCategory,
          category: Array.isArray(category) ? category[0] : category,
          status: Array.isArray(status) ? status[0] : status,
          images: imageUrls, // Store the array of image URLs
        },
      });

      return res.json({ status: 200, data: newPost, msg: "Post created." });
    } catch (uploadError) {
      console.error(uploadError);
      res.status(500).json({ success: false, error: uploadError.message });
    }
  });
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
            user: true, // Optionally include user details in joinCampingPosts
            post: true
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

module.exports = {
    fetchCampings,
    createPost,
    campingPostDetails,
    onePostParticipants
    
    
}
