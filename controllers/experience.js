const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey1.json');
const formidable = require('formidable')
const fs = require('fs');
const path = require('path');


//Create experience
// const createExperience = async (req, res) => {
//   try {
//     const { title, content, imagesUrl, location, category, filterCategory, userId } = req.body;

//     // Validate required fields
//     if (!title || !content || !location || !category || !userId || !filterCategory) {
//       return res.status(400).json({ error: 'All fields are required.' });
//     }

//     const newExperience = await prisma.experiencesTips.create({
//       data: {
//         title,
//         content,
//         imagesUrl,
//         location,
//         category,
//         filterCategory,
//         user: {
//           connect: { id: userId }
//         },
//         likeCounter: 0,  // Initial value for likeCounter
//         shareCounter: 0,  // Initial value for shareCounter
//       },
//     });

//     res.status(201).json(newExperience);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while creating the experience.' });
//   }
// };


// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://experience-upload.appspot.com" 
},'second app');




 const bucket = admin.storage().bucket();

 const uploadDir = path.join(__dirname, '../uploads');
 if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
 }
 

// const createExperience = async (req, res) => {
//   // Initialize formidable for handling multipart form data (including file uploads)
//   const form = formidable.IncomingForm({
//     uploadDir: uploadDir, // Directory to store uploaded files temporarily
//     keepExtensions: true, // Keep file extensions
//   }) // Allows multiple files

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       // Handle parsing errors
//       res.status(500).json({ success: false, error: err });
//     }  
//       try {
//         let image_url; // Store the downloaded image URL

//         // Access the uploaded file details
//         const file = files['file_variable_name'][0]; // Assuming a single file

//         if (!file) {
//           // Handle missing file scenario
//           return res.status(400).json({ error: 'No file uploaded.' });
//         }

//         const filePath = file.filepath;
//         const originalFilename = file.originalFilename; // Optional, get original name

//         // Set preferred path on Firebase storage (consider dynamic filenames)
//         const remoteFilePath = `images/${originalFilename}`; // Use original name if desired

//         // Upload the image to Firebase storage
//         await bucket.upload(filePath, { destination: remoteFilePath });

//         // Options for getSignedUrl()
//         const options = {
//           action: 'read',
//           expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
//         };

//         // Get a signed URL for accessing the uploaded image
//         const signedUrl = await bucket.file(remoteFilePath).getSignedUrl(options);
//         console.log(signedUrl)
//         image_url = signedUrl[0];

//         console.log(image_url);

//         // Extract form data (handle potential missing fields gracefully)
//         const { title, content, location, category, filterCategory, userId } = fields || {};

//         // Validate required fields
//         if (!title || !content || !location || !category || !filterCategory || !userId) {
//           return res.status(400).json({ error: 'All fields are required.' });
//         }

//         // Create a new experience record in the database (using a more descriptive variable name)
//         const newExperience = await prisma.experiencesTips.create({
//           data: {
//             title,
//             content,
//             imagesUrl: image_url,
//             location,
//             category,
//             filterCategory,
//             user: { connect: { id: userId } },
//             likeCounter: 0,
//             shareCounter: 0,
//           },
//         });

//         console.log("Experience created successfully!"); // Informative message

//         // Send the created experience back to the frontend
//         res.status(201).json(newExperience);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while creating the experience.' });
//       }
//     }
//   });
// };


/************************************************* */

const createExperience = async (req, res) => {
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
      const fileArray = Array.isArray(files.imagesUrl ) ? files.imagesUrl  : [files.imagesUrl ]; // Handle single or multiple files

      if (!fileArray || fileArray.length === 0) {
        return res.status(400).json({ success: false, error: 'No image files provided' });
      }

      // Process each image and get their URLs
    //   console.log(fileArray);
      const imageUrls = await Promise.all(fileArray.map(async (file) => {
        const filePath = file.filepath; // Path to the temporary file
        const timestamp = Date.now(); // Optional: for unique file names
        const remoteFilePath = `uploads/images/${timestamp}-${file.originalFilename}`;
        console.log( "filepath",filePath)
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
      const { userId, title, content, location, category, filterCategory} = fields;

      // Create the new camping post with the image URLs
      const newEperiences = await prisma.experiencesTips.create({
        data: {
          userId: Number(userId),
          title: Array.isArray(title) ? title[0] : title,
          content: Array.isArray(content) ? content[0] : content,
          location: Array.isArray(location) ? location[0] : location,
          filterCategory: Array.isArray(filterCategory) ? filterCategory[0] : filterCategory,
          category: Array.isArray(category) ? category[0] : category,
          likeCounter: 0,
          shareCounter:0,
          imagesUrl: imageUrls, // Store the array of image URLs
        },
      });

      return res.json({ status: 200, data: newEperiences, msg: "Experiences created." });
    } catch (uploadError) {
      console.error(uploadError);
      res.status(500).json({ success: false, error: uploadError.message });
    }
  });
};

/************************************************* */
// Get experience by ID with comments, likes, and shares
const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the id is parsed as an integer
    const experienceId = parseInt(id, 10);

    // Validate if experienceId is a number
    if (isNaN(experienceId)) {
      return res.status(400).json({ error: 'Invalid experience ID.' });
    }

    const experience = await prisma.experiencesTips.findUnique({
      where: { id: experienceId },
      include: {
        user: true, // Include the user who created the experience
        comments: {
          include: {
            user: true, // Include the user who commented
          }
        },
        likes: {
          include: {
            user: true, // Include the user who liked
          }
        },
        shares: {
          include: {
            user: true, // Include the user who shared
          }
        }
      }
    });

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found.' });
    }

    res.status(200).json(experience);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching the experience.' });
  }
};

// Get all experiences along with their creators
const getAllExperiences = async (req, res) => {
  try {
    // Fetch all experiences including the user who created each experience
    const experiences = await prisma.experiencesTips.findMany({
      include: {
        user: true, // Include the user who created the experience
        comments: {
          include: {
            user: true, // Include the user who commented
          }
        },
        likes: {
          include: {
            user: true, // Include the user who liked
          }
        },
        shares: {
          include: {
            user: true, // Include the user who shared
          }
        }
      }
    });

    res.status(200).json(experiences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong while fetching experiences.' });
  }
};

module.exports = {
  createExperience,
  getExperienceById,
  getAllExperiences
};
