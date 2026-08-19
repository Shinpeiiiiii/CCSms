const transporter = require('../../../config/mailer');

const sendWelcomeEmail = async ({
    to,
    fullName,
    studentNumber,
    temporaryPassword,
}) => {

   await transporter.sendMail({
        from: `CCsms <${process.env.EMAIL_USER}>`,
        to,
        subject: "Welcome to CCsms",
        html: `
            <h2>Welcome, ${fullName}!</h2>
            <p>Your student account has been created.</p>
            <p><strong>Student Number:</strong> ${studentNumber}</p>
            <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
            <p>Please log in and change your password immediately.</p>
        `,
    });

    console.log("Welcome email sent successfully");

};

module.exports = sendWelcomeEmail;