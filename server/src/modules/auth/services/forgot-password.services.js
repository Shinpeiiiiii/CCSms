const Verification = require('../../verification/models/verification.model');
const sendVerificationCode = require('../../verification/utils/sendVerificationCode');
const User = require('../../auth/models/User');
const bcrypt = require('bcrypt');

const requestPasswordReset = async ({ email }) => {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
        return { message: "If an account with that email exists, a verification code has been sent." };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await Verification.deleteMany({
        email: user.email,
        purpose: 'Password Reset',
        verified: false,
    });

    await Verification.create({
        email: user.email,
        code,
        purpose: 'Password Reset',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    try {
        await sendVerificationCode(user.email, code);
    } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
    }

    return { message: "If an account with that email exists, a verification code has been sent." };
};

const resetPassword = async ({ email, code, newPassword }) => {
    const record = await Verification.findOne({
        email,
        purpose: 'Password Reset',
        verified: false,
    });

    if (!record) {
        throw new Error("No password reset request found. Please request a new code.");
    }

    if (record.expiresAt < new Date()) {
        throw new Error("Verification code has expired. Please request a new code.");
    }

    if (record.attempts >= 5) {
        throw new Error("Too many invalid attempts. Request a new code.");
    }

    if (record.code !== code) {
        record.attempts += 1;
        await record.save();
        throw new Error("Invalid verification code.");
    }

    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User not found.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.mustChangePassword = false;
    user.tokenVersion += 1;
    await user.save();

    record.verified = true;
    await record.save();

    return { message: "Password has been reset successfully." };
};

module.exports = {
    requestPasswordReset,
    resetPassword,
};
