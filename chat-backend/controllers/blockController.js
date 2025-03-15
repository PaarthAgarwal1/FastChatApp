const message = require('../models/message');
const User=require('../models/user');

const blockUser=async(req,res)=>{
    try {
        const{blockUserId}=req.params;
        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message:"user not found"});
        }
        if(user.blocked.includes(blockUserId)){
            return res.status(400).json({message:"user is already blocked"});
        }
        user.blocked.push(blockUserId);
        await user.save();
        res.status(200).json({message:"userBlocked successfully",blocked:user.blocked});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const unblockUser=async(req,res)=>{
    try {
        const{unblockUserId}=req.params;
        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message:"user not found"});
        };

        user.blocked=user.blocked.filter(_id=>_id.toString()!==unblockUserId);
        await user.save();

        res.status(200).json({message:"user unblocked successfully",blocked:user.blocked});

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports={blockUser,unblockUser};