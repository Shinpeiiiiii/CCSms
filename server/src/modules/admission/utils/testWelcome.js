require("dotenv").config();
const sendVerificationCode = require("../../verification/services/verification.service");

(async () => {
    try{
        await sendVerificationCode("kouorai@gmail.com","123456");
        console.log("Email sent.");
    }catch(error){
        console.error(error);
    }
})();