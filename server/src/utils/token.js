const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
    console.log("Generate:",process.env.JWT_REFRESH_SECRET);
    return jwt.sign(
        {
            id: user._id,
            role: user.role,
            tokenVersion: user.tokenVersion,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m",
        }
    );

};

const generateRefreshToken = (user) => {
    console.log("Genereate Refresh:",process.env.JWT_REFRESH_SECRET);
    return jwt.sign(
        {
            id: user._id,
            tokenVersion: user.tokenVersion,
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: "5h",
        }
    );

};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};