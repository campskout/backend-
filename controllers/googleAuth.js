const prisma = require('../database/prisma.js')
const nodemailer = require('nodemailer');
const crypto = require('crypto');

require("dotenv").config()

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your preferred service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// Helper function to generate a random token
const generateToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

const emailVerifications = async (req, res) => {
  const { email } = req.body;

  // Check if the user exists
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).send('User not found');
  }

  const token = generateToken();
  await prisma.user.update({
    where: { email },
    data: { verificationToken: token, tokenExpiry: new Date(Date.now() + 3600000) }, // Token valid for 1 hour
  });

  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;

  // Send the email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification',
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send({ message: 'Verification email sent', token });
  } catch (error) {
    res.status(500).send('Error sending email');
  }
};


const verifyEmail = async (req, res) => {
  const { token } = req.query;

  // Check if the token is valid
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      tokenExpiry: {
        gt: new Date() // Check if token has not expired
      }
    }
  });

  if (!user) {
    return res.status(400).send('Invalid or expired token');
  }

  // Mark the user as verified
  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified : true,
      verificationToken: null,
      tokenExpiry: null,
    },
  });

  res.send('Email verified successfully');
};



module.exports ={
  verifyEmail,
  emailVerifications
}

/*var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:5000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));*/