
const prisma = require('../database/prisma.js');

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      console.log(jwt_payload, "passport payload")
      try {
        const user = await prisma.user.findUnique({ where: { id: jwt_payload.id } })
        console.log(user);
        
        if (user) {
          return done(null, user);
        } else {
          return done(null, false); // User not found
        }
      } catch (err) {
        return done(err, false); // Error fetching user
      }
    })
  );
};


