const express = require('express');
const {updateProfile, updateProfilePicture, getAllUsers, getAllFriends} = require('../controllers/userController');
const protectRoute = require('../middleware/auth.middleware');
const router = express.Router();

router.put('/update-profile',protectRoute,updateProfile);
router.put('/update-profile-picture',protectRoute,updateProfilePicture);
router.get('/all-users',protectRoute,getAllUsers);
router.get('/friends',protectRoute,getAllFriends);

module.exports=router;
