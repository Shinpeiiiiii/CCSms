const verificationTemplate = (code) => {
    return `
        <div style="font-family: Arial, sans-serif; padding:30px;">
            <h2>TeacherPortal Email Verification</h2>

            <p>Your verification code is:</p>

            <div style="
                font-size:36px;
                font-weight:bold;
                letter-spacing:8px;
                margin:20px 0;
                color:#2563eb;
            ">
                ${code}
            </div>

            <p>
                This code will expire in
                <strong>5 minutes</strong>.
            </p>

            <p>
                If you didn't request this,
                simply ignore this email.
            </p>
        </div>
    `;
};

module.exports = verificationTemplate;