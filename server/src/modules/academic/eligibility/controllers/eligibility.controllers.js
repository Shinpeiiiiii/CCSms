const eligibilityService = require("../services/");

const checkEligibility = async (req, res) => {

    try {

        const result = await eligibilityService.checkEligibility(
            req.body
        );

        return res.status(200).json(result);

    } catch (error) {

        return res.status(400).json({
            message: error.message,
        });

    }

};

module.exports = {
    checkEligibility,
};