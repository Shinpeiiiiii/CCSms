const Verification = require("../models/verification.model");
const { sendEmail, } = require("../../email/services/email.service");
const verificationTemplate = require("../../email/templates/verification.template");


const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 90000).toString();
};


const sendVerificationCode = async ({
    email,
    purpose,
}) => {

    // Normalize email
    email = email.toLowerCase().trim();

    // Check existing verification
    const existing = await Verification.findOne({
        email,
        purpose,
    });

    if (existing) {

        const secondsPassed = (Date.now() - existing.createdAt.getTime()) / 1000;

        if (secondsPassed < 60) {
            throw new Error(
                `Please wait ${Math.ceil(60 - secondsPassed)} seconds before requesting another code.`
            );
        }

        await Verification.deleteOne({
            _id: existing._id,
        });

    }

    const code = generateOTP();

    const expiresAt = new Date( Date.now() + 5 * 60 * 1000);

    await Verification.create({
        email,
        code,
        purpose,
        expiresAt,
    });

    await sendEmail({
        to: email,
        subject: "School Enrollment Application Verification Code",
        html: verificationTemplate(code),
    });

    return { message: "Verification code sent.", };

};

module.exports = {
    generateOTP,
    sendVerificationCode,
};

module.exports = {generateOTP};