const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ROLES, inRole } = require('../security/Rolemiddleware');
const { fetchUsers, updateUserInterests , getUserById} = require('../controllers/users.js');
const { Login, Test, Admin } = require('../controllers/authController.js');
const { validateRegister, registerUser } = require("../controllers/Authentication");

router.get('/get', fetchUsers);
router.post('/login', Login);
router.post('/register', validateRegister(), registerUser);
router.post('/updateInterests', passport.authenticate('jwt', { session: false }), updateUserInterests);


// routes test
router.get('/test', passport.authenticate('jwt', { session: false }),Test)
router.get('/admin', passport.authenticate('jwt', { session: false }), inRole(ROLES.admin), Admin)
// get user by id  
router.get('/:id', getUserById);

module.exports = router;
