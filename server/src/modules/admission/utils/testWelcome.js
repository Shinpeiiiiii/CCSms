require("dotenv").config();
const sendVerificationCode = require("../../verification/utils/sendVerificationCode");
console.log(sendVerificationCode);
(async () => {
    try{
        await sendVerificationCode("kouorai@gmail.com","123456")
        console.log("Email sent.");
    }catch(error){
        console.error(error);
    }
})();