const jwt = require("jsonwebtoken");

const User = require("../models/User");

const {
    generateAccessToken,
    generateRefreshToken,
} = require("../../../utils/token");

const refresh = async (req, res) => {

    try {
        console.log("Cookies", req.cookies);
        const Refreshtoken = req.cookies.refreshToken;
        console.log("Refresh Token:", Refreshtoken);

        if (!Refreshtoken) {

            return res.status(401).json({

                message:
                    "Refresh token missing.",

            });

        }

        const payload =
            jwt.verify(
                Refreshtoken,
                process.env.JWT_REFRESH_SECRET
            );
        console.log(payload);

        const user = await User.findById(payload.id);
        console.log(user);
        if (!user) { return res.status(401).json({ message: "Invalid user.", }); }

        if (
            payload.tokenVersion !==
            user.tokenVersion
        ) {
            return res.status(401).json({
                message: "Invalid refresh token.",
            });
        }
        const NewaccessToken = generateAccessToken(user);
        const NewrefreshToken = generateRefreshToken(user);
        console.log("Generated new access token");

        res.cookie("refreshToken", NewrefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
            secure: true,
            maxAge: 5 * 60 * 60 * 1000,
        });

        return res.json({accessToken: NewaccessToken, });
    }
    catch {
        return res.status(401).json({ message: "refresh token expired.", });
    }
};

module.exports = refresh;