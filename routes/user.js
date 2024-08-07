const express = require('express');
const router = express.Router();
const passport = require('passport');
const { ROLES, inRole } = require('../security/Rolemiddleware');
const { searchUsersByName,fetchUsers, updateUserInterests , getUserById,deleteUser} = require('../controllers/users.js');
const { Login, Test, Admin,authenticateToken,changePassword } = require('../controllers/authController.js');
const { validateRegister, registerUser } = require("../controllers/Authentication");

router.get('/get', fetchUsers);
router.post('/login', Login);
router.post('/register', validateRegister(), registerUser);

router.post('/updateInterests', updateUserInterests);
router.get('/search', searchUsersByName);



// routes test
router.get('/test', passport.authenticate('jwt', { session: false }),Test)
router.get('/admin', passport.authenticate('jwt', { session: false }), inRole(ROLES.admin), Admin)
// get user by id  
router.get('/:id', getUserById);
router.delete('/:id',deleteUser)

router.post('/changePassword',authenticateToken,changePassword)

module.exports = router;
