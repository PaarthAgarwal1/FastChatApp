const express = require('express');
const { registerUser, loginUser, logoutUser, checkUser } = require('../controllers/authController');
const protectRoute = require('../middleware/auth.middleware');
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout",logoutUser);
router.get("/check",protectRoute,checkUser);

module.exports = router;