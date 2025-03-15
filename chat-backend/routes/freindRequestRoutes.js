const express=require('express');
const protectRoute = require('../middleware/auth.middleware');
const { sendFriendRequest, acceptFriendRequest, declineFriendRequest, getFriendRequests } = require('../controllers/friendRequestController');
const router=express.Router();

router.post('/send/:receiverId',protectRoute,sendFriendRequest);
router.post('/accept/:requestId',protectRoute,acceptFriendRequest);
router.delete('/reject/:requestId',protectRoute,declineFriendRequest);
router.get('/pending',protectRoute,getFriendRequests);

module.exports=router;

