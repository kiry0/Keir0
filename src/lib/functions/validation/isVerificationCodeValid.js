const User = require("../../../models/User.js");

async function isVerificationCodeValid(value, helpers) {
    try {
        const user = await User.findOne({ "verification.code.value": value });

        const error = new Error();
        
        error.name = "JoiExternalError";
        error.message = "Unable to verify your account! A user with that verificationCode does not exist or is invalid!";
        error.statusCode = 410;
    
        if(!user) throw error;

        // value = "Hello, World!";
        // console.log("verificationCode:", value);

        return value;
    } catch (err) {
        console.error(err);

        return err;
    };
};

module.exports = isVerificationCodeValid;