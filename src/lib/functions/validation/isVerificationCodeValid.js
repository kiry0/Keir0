const User = require("../../../models/User.js");

const JoiExternalValidationError = require("../../classes/JoiExternalValidationError.js");

const isVerificationCodeValid = async (verificationCode, helpers) => {
    try {
        const user = await User.findOne({ "verification.code.value": verificationCode });

        if(!user) throw new JoiExternalValidationError("Unable to verify your account! A user with that verificationCode does not exist!");

        const isVerificationCodeExpired = (verificationCode) => {
            // { milliseconds / 3.6e6 } returns hour/hours.
            return Math.floor(Math.abs(new Date() - verificationCode.expiresAt) / 3.6e6) <= 0 ? true : false;
        };

        if(isVerificationCodeExpired(user.verification.code)) throw new JoiExternalValidationError("It looks like your verificationCode expired!");

        return value;
    } catch(err) {
        console.error(err);

        return err;
    };
};

module.exports = isVerificationCodeValid;