const joi = require('joi');

const isPhoneNumberValid = require("../lib/functions/validation/isPhoneNumberValid.js")
    , isVerificationCodeValid = require("../lib/functions/validation/isVerificationCodeValid.js");

const verify = joi.object({
    verificationCode: joi
                         .string()
                         .min(8)
                         .max(8)
                         .required()
                         .external(isVerificationCodeValid, "verificationCode")
});

module.exports = {
    verify
};