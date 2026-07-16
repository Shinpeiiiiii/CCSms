const { sendEmail } = require('../services/email.services')
const verificationTemplate = require('../template/verification.template')

const sendTestEmail = async (req, res) => {
    try{
        await sendEmail({
            to: req.body.email,
            subject: "Test email test",
            html: verificationTemplate("123456"),
        });

        res.json({
            message: "Email sent successfully.",
        });

    }catch(err){
        console.error(err)
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {  sendTestEmail };