const bcrypt = require('bcryptjs');

const User = require('../models/user');
const generateToken = require('../utils/jwt');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if(!username||!email||!password){
            return res.status(400).json({message: "Please enter all fields"});
        }
        if(password.length<6){
            return res.status(400).json({message: "Password should be at least 6 characters"});
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({ username, email, password: hashedPassword });
        if(newUser){
            await generateToken(newUser._id,res);
            newUser.password=undefined;
            return res.status(201).json({newUser, message: "User created successfully"});
        }else{
            return res.status(400).json({message: "Failed to create user"});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        await generateToken(user._id,res);
        user.password=undefined;
        res.status(200).json({user,message:"login successful"});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(200).json({ message: "logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const checkUser=async(req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { registerUser, loginUser, logoutUser, checkUser };