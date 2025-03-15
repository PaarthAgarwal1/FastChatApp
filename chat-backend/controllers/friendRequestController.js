const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');
const Chat = require("../models/chat");

const sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.params;
        const senderId = req.user._id;
        
        if (senderId.toString() === receiverId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender_id: senderId, receiver_id: receiverId },
                { sender_id: receiverId, receiver_id: senderId }
            ]
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        const newRequest = await FriendRequest.create({
            sender_id: senderId,
            receiver_id: receiverId,
            status: 'pending'
        });

        // TODO: Send notification to receiver (via Socket.io or Firebase)
        
        res.status(201).json({ message: 'Friend request sent successfully', newRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        if (request.receiver_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to accept this friend request' });
        }

        if (request.status !== "pending") {
            return res.status(400).json({ message: 'Friend request is not pending' });
        }

        request.status = "accepted";
        await request.save();

        await User.findByIdAndUpdate(request.sender_id, { $push: { friends: request.receiver_id } });
        await User.findByIdAndUpdate(request.receiver_id, { $push: { friends: request.sender_id } });

        const newChat = await Chat.create({
            chat_type: "one-to-one",
            members: [request.sender_id, request.receiver_id],
        });

        // TODO: Send notification to sender about acceptance

        res.status(200).json({ message: "Friend request accepted successfully", chatId: newChat._id });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const declineFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await FriendRequest.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "Friend request not found." });
        }

        if (request.receiver_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to decline this request." });
        }

        await request.deleteOne();

        res.status(200).json({ message: "Friend request declined." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const friendRequests = await FriendRequest.find({ receiver_id: userId, status: "pending" })
            .populate('sender_id', 'username email profile_picture status'); // Corrected syntax

        res.status(200).json({ friendRequests });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { sendFriendRequest, acceptFriendRequest, declineFriendRequest, getFriendRequests };
