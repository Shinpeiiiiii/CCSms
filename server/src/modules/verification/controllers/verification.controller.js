const {requestVerificationCode, verifyRequestCode} = require("../services/verification.service");

const sendCode = async (req, res) => {
    try {
        const result = await requestVerificationCode({
            email: req.body.email,
            purpose: req.body.purpose,
        });
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message,});
    }
};

const verifyCode = async (req, res) => {
    try{
        const result = await verifyRequestCode({
            email: req.body.email,
            code: req.body.code,
            purpose: req.body.purpose,
        });
        return res.status(200).json(result);

    }catch(error){
        return res.status(400).json({message: error.message});
    }
}


module.exports = { sendCode, verifyCode};