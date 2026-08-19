const User = require("../models/User");

const logout = async (req, res) => {

    try {

        if (req.user) {

            const user = await User.findById(req.user.id);

            if (user) {

                user.tokenVersion += 1;

                await user.save();

            }

        }

        res.clearCookie("refreshToken");
        
        return res.status(200).json({
            message: "Logged out successfully.",
        });

    }

    catch (error) {

        return res.status(500).json({
            message: error.message,
        });

    }

};

module.exports = logout;