const express = require('express');
const protectRoute = require('../middleware/auth.middleware');
const { getMessages, sendMessage,recentMessage } = require('../controllers/messageController');
const router = express.Router();

router.get('/:receiverId',protectRoute,getMessages);
router.post('/send/:receiverId',protectRoute,sendMessage);
router.get("/recent/:userId/:friendId",protectRoute,recentMessage);

module.exports=router;