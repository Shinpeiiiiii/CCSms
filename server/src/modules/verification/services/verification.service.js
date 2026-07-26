const Verification = require('../models/verification.model');
const sendVerificationCode = require('../utils/sendVerificationCode');
const User = require('../../auth/models/User');

const requestVerificationCode = async ({email, purpose = "Enrollment Application"}) => {

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("This email is already registered. Please login instead.");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await Verification.deleteMany({
        email, purpose, verified: false,
    })

    await Verification.create({
        email, code, purpose, expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
    });

    await sendVerificationCode(email, code);

    return {message: "Verification code successfully.",}

    console.log("Verification email sent successfully.")
};

const verifyRequestCode = async ({
    email,
    code,
    purpose = "Enrollment Application"
}) => {

    const record = await Verification.findOne({
        email,
        purpose,
        verified: false,
    });

    if (!record) {
        throw new Error(
            "No verification request found."
        );
    }

    if (record.expiresAt < new Date()) {
        throw new Error(
            "Verification code has expired."
        );
    }

    // Limit attempts
    if (record.attempts >= 5) {
        throw new Error(
            "Too many invalid attempts. Request a new code."
        );
    }

    if (record.code !== code) {

        record.attempts += 1;
        await record.save();

        throw new Error(
            "Invalid verification code."
        );
    }

    record.verified = true;
    await record.save();

    return {
        verified: true,
        message: "Email verified successfully.",
    };
};

module.exports = {requestVerificationCode, verifyRequestCode};