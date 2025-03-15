const express = require('express');
const protectRoute = require('../middleware/auth.middleware');
const { blockUser, unblockUser } = require('../controllers/blockController');
const router = express.Router();

router.put('/block/:blockUserId',protectRoute,blockUser);
router.put('/unblock/:unblockUserId',protectRoute,unblockUser);

module.exports = router;