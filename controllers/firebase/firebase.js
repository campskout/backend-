// const formidable = require('formidable'); // Using formidable to handle file requests
// const admin = require('firebase-admin');
// const serviceAccount = require('../../serviceAccountKey.json'); // Adjust the path to your service account key

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "creat-5d81c.appspot.com" // Replace with your actual bucket name
// });

// const bucket = admin.storage().bucket();

// const creat = (req, res) => {
//   // Initialize formidable
//   const form = new formidable.IncomingForm();

//   // Parse the incoming request
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ success: false, error: err.message });
//     }

//     console.log('Files object:', files); // Log the entire files object

//     try {
//       // Access the file from the files object
//       const fileArray = files.image; // This is an array
//       if (!fileArray || fileArray.length === 0) {
//         return res.status(400).json({ success: false, error: 'File not provided' });
//       }

//       const file = fileArray[0]; // Access the first file in the array
//       console.log('File object:', file); // Log the file object to check its properties

//       const filePath = file.filepath; // Path to the temporary file
//       if (!filePath) {
//         return res.status(400).json({ success: false, error: 'File path not found' });
//       }

//       console.log('File path:', filePath); // Log the file path to ensure it's correct

//       const timestamp = Date.now(); // Optional: for unique file names
//       const remoteFilePath = `uploads/images/${timestamp}-${file.originalFilename}`;

//       // Upload the image using the bucket.upload() function
//       await bucket.upload(filePath, { destination: remoteFilePath });

//       // Options for the getSignedUrl() function
//       const options = {
//         action: 'read',
//         expires: Date.now() + 24 * 60 * 60 * 1000 // 1 day
//       };

//       // Generate a signed URL for the uploaded file
//       const [signedUrl] = await bucket.file(remoteFilePath).getSignedUrl(options);
//       console.log("single",signedUrl)
//       const image_url = signedUrl; // Save the signed URL to image_url

//       console.log('Image URL:', image_url);

//       // Send the image URL back to frontend
//       res.status(200).json({ success: true, url: image_url });
//     } catch (uploadError) {
//       console.error(uploadError);
//       res.status(500).json({ success: false, error: uploadError.message });
//     }
//   });
// };

// module.exports = { creat };
