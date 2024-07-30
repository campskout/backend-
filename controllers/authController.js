const prisma = require('../database/prisma.js')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const Login = async (req, res) => {

    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: "username and password are required" });
    }
    try {
        // Finding the user by email in the database
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });

        // If user is not found
        if (!user) {
            return res.status(400).json({ error: "User not found. Please sign up." });
        }

       /* if (req.body.password !== user.password) {
            return res.status(400).json({ error: "Wrong Password" });
        }*/


        // Comparing the provided password with the hashed password stored in the database
         const isMatch = await bcrypt.compare(req.body.password, user.password);
         if (!isMatch) {
             return res.status(400).json({ error: "Wrong Password" });
         }


        // If credentials are correct, create a JWT token
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
                imagesProfile:user.imagesProfile,
                role: 'user'
            },
            process.env.JWT_SECRET, // Secret key for JWT signing
            { expiresIn: '1h' }     // Token expiration time
        );

        // Return success message along with the generated token
        res.status(200).json({
            message: "success",
            token: "Bearer " + token, // Prefixing the token with 'Bearer ' as per convention
            role: 'user'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
}

const Test = (req, res) => {
    res.send("Welcome User")
      
}

const Admin = (req, res) => {
    res.send("Welcome Admin")
}


module.exports = {
    Login,
    Test,
    Admin
}
