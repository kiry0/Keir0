const joi = require('joi');

const isPhoneNumberValid = require("../lib/functions/validation/isPhoneNumberValid.js")
    , isVerificationCodeValid = require("../lib/functions/validation/isVerificationCodeValid.js");

const login = joi.object({
    emailAddress: joi
                     .string()
                     .min(3)
                     .max(320)
                     .email()
                     .lowercase(),
    phoneNumber: joi
                    .when("emailAddress", {
                        is: "",
                        then: joi   
                                 .required()
                    })
                    .custom(isPhoneNumberValid, "phoneNumber")
                    .message({
                        "any.custom": "Your phone number is invalid!"
                    }),
    username: joi
                 .string()
                 .alphanum()
                 .min(4)
                 .max(40)
                 .when("emailAddress", { 
                     is: "",
                     then: joi.when("phoneNumber", {
                         is: "",
                         then: joi.required()
                     }
                 )}
    ),
    password: joi
                 .string()
                 .min(8)
                 .max(64)
                 .required()
});

const verify = joi.object({
    verificationCode: joi
                         .string()
                         .min(8)
                         .max(8)
                         .required()
                         .external(isVerificationCodeValid, "verificationCode")
});

module.exports = {
    login,
    verify
};