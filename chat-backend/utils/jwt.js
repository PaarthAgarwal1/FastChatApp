const jwt = require("jsonwebtoken");

const generateToken = async (userId, res) => {
    try {
        const token = await jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: "1d"
        });
        res.cookie("jwt", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
    } catch (error) {
        console.error("Error generating token:", error);
        res.status(500).send("Error generating token");
    }
}
module.exports = generateToken;