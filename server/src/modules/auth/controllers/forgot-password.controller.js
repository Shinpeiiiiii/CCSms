const { requestPasswordReset, resetPassword } = require('../services/forgot-password.services');

const requestReset = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        await requestPasswordReset({ email });

        return res.status(200).json({
            message: 'If an account with that email exists, a verification code has been sent.',
        });
    } catch (error) {
        console.error('Password reset request error:', error);
        return res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

const confirmReset = async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({ message: 'Email, code, and new password are required.' });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long.' });
        }

        const result = await resetPassword({ email, code, newPassword });

        return res.status(200).json(result);
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    requestReset,
    confirmReset,
};
