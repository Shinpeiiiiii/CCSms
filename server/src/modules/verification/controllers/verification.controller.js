const {sendVerificationCode, } = require("../services/verification.service");

const sendCode = async (req, res) => {
    try {
        const result = await sendVerificationCode(req.body);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message,});
    }
};

module.exports = { sendCode,};