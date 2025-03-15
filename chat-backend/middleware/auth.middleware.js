const jwt=require("jsonwebtoken");
const User=require("../models/user");

const protectRoute=async (req,res,next)=>{
    try {
        const token=req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized -No Token Provided"});
        }
        const decoded=await jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized -Invalid Token"});
        }
        const user=await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({message:"Unauthorized -User Not Found"});
        }
        req.user=user;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports=protectRoute;