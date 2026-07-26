const transporter = require("../../../config/mailer");

const sendVerificationCode = async (email, code) => {

    await transporter.sendMail({
        from: `CCSms <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "CCSms Email Verification",
        html: `
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing:4px">${code}</h1>
            <p>This code will expire in 10 minutes.</p>
        `,
    });
    console.log("Verification email sent successfully");
};

module.exports = sendVerificationCode;