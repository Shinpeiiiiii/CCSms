const validateEligibility = require("../../curriculum/validators/");

const checkEligibility = async (data) => {

    return await validateEligibility(data);

};

module.exports = {
    checkEligibility,
};