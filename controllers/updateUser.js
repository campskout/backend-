const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');
const admin = require('firebase-admin');

// Firebase setup
var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "creat-5d81c.appspot.com" // Replace with your actual bucket name
},"update");

const bucket = admin.storage().bucket();

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Update User function
async function updateUser(req, res) {
    const form = new formidable.IncomingForm({
        uploadDir: uploadDir, // Directory to store uploaded files temporarily
        keepExtensions: true, // Keep file extensions   
    });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.log(err);
            
            return res.status(500).json({
                success: false, 
                error: err.message
            });
        }
        
        // console.log(fields, files);
        
        const { id } = req.params;
        const {name, address, interests, gender, bio, phoneNumber, dateOfBirth  } = fields;
                            
        try {
            const user = await prisma.user.findUnique({
                where: { id: parseInt(id, 10) }
            });
            
            if (!user) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }
            
            // Handle image uploads
            // const imageFiles = files.imagesProfile; 
            console.log(fields, files);
            console.log(files.imageProfile,'ertyuio');
            const imageUrls = null;
            if (files.imageProfile) {
                const file = files.imageProfile;

        const timestamp = Date.now();
        const remoteFilePath = `uploads/users/${id}/${timestamp}-${file[0].originalFilename}`;

             await bucket.upload(file[0].filepath, { destination: remoteFilePath });

             const [signedUrl] = await bucket.file(remoteFilePath).getSignedUrl({
                action: 'read',
                expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
              });
// console.log(signedUrl,'zertyuiopm');

              const imageStr = signedUrl
            // Update user data
            const updatedUser = await prisma.user.update({
                where: { id: parseInt(id, 10) },
                data: {
                    name:name[0],
                    address:address[0],
                    interests:Array.isArray(interests) ? interests[0].split(',') : interests.split(','), // Handle interests
                    imagesProfile:imageStr, // Concatenate existing and new image URLs
                    gender:gender[0],
                    bio:bio[0],
                    phoneNumber: Array.isArray(phoneNumber) ? phoneNumber[0] : phoneNumber,
                    dateOfBirth:Array.isArray(dateOfBirth) ? dateOfBirth[0] : dateOfBirth,
                },
            });

            res.json({ success: true, user: updatedUser });
        }} catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ success: false, error: 'Failed to update user' });
        }
});
}

module.exports = { updateUser };
