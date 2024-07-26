const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ROLES, inRole } = require('../security/Rolemiddleware');
const { fetchUsers } = require('../controllers/users.js');
const { Login, Test, Admin } = require('../controllers/authController.js');
const { validateRegister, registerUser } = require("../controllers/Authentication");

router.get('/get', fetchUsers)
router.post('/login', Login)
router.post('/register', validateRegister(), registerUser);

// routes test
router.get('/test', passport.authenticate('jwt', { session: false }),Test)
router.get('/admin', passport.authenticate('jwt', { session: false }), inRole(ROLES.admin), Admin)


module.exports = router;
