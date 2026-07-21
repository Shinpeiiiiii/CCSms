const bcrypt = require("bcrypt");
const User = require("../models/User");

const changePassword = async (
    userId,
    currentPassword,
    newPassword
) => {

    const user = await User.findById(userId);

    if (!user)
        throw new Error("User not found.");

    const isMatch =
        await bcrypt.compare(
            currentPassword,
            user.password
        );

    if (!isMatch)
        throw new Error("Current password is incorrect.");

    const hashedPassword =
        await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.mustChangePassword = false;

    await user.save();

    return;
};

module.exports = {changePassword};