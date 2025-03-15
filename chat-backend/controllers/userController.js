const bcrypt = require('bcryptjs');
const User = require('../models/user');
const cloudinary = require('../config/cloudinary');

const updateProfile = async (req, res) => {
    try {
        const { username, email ,description} = req.body;
        const userId = req.user._id;
        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                username,
                email,
                description,
            },
            { new: true }
        );

        res.status(200).json({ updateUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProfilePicture=async(req,res)=>{
    try {
        const {profile_picture} = req.body;
        const userId = req.user._id;

        let uploadResponse;
        if (profile_picture) {
            uploadResponse = await cloudinary.uploader.upload(profile_picture);
        }

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {
                profile_picture: uploadResponse ? uploadResponse.secure_url : req.user.profile_picture,
            },
            { new: true }
        );

        res.status(200).json({ updateUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllFriends = async (req, res) => {
    try {
        const currentUserId = req.user._id;

        const currentUser = await User.findById(currentUserId).populate({
            path: "friends",
            select: "-password",
        });

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const friendsList = currentUser.friends.map(friend => ({
            _id: friend._id,
            username: friend.username,
            email: friend.email,
            blocked:friend.blocked,
            profile_picture: friend.profile_picture,
            description: friend.description,
            status: friend.status,
        }));

        res.status(200).json({ friends: friendsList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports={updateProfile,updateProfilePicture,getAllUsers,getAllFriends};