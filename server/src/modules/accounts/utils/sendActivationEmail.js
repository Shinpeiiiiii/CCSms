const crypto = require('crypto');
const transporter = require('../../../config/mailer');

const generateActivationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

const sendAccountActivationEmail = async (email, firstName, token) => {
    const baseUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
    const activationUrl = `${baseUrl}/activate-account?token=${token}`;

    await transporter.sendMail({
        from: `CCSms <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Activate your CCSms Account',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Welcome to CCSms, ${firstName}!</h2>
                <p style="color: #555; font-size: 16px;">
                    Your account has been created. To complete your registration and set your password, please click the button below:
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${activationUrl}" 
                       style="background-color: #6366F1; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
                        Activate Account
                    </a>
                </div>
                <p style="color: #777; font-size: 14px;">
                    This link will expire in 24 hours. If you did not request this account, please ignore this email.
                </p>
                <p style="color: #999; font-size: 12px; margin-top: 40px;">
                    If the button above doesn't work, copy and paste this URL into your browser:<br>
                    <span style="color: #666;">${activationUrl}</span>
                </p>
            </div>
        `,
    });

    console.log(`Activation email sent to ${email}`);
};

module.exports = { generateActivationToken, sendAccountActivationEmail };
