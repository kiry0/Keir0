const joi = require('joi');

const isValidPhoneNumber = require("../lib/functions/validation/isValidPhoneNumber.js")
    , passwordStrength = require("../lib/functions/validation/passwordStrength.js");

const register = joi.object(
    {
        firstName: joi
                      .string()
                      .min(1)
                      .max(64)
                      .required(),
        lastName: joi
                     .string()
                     .min(1)
                     .max(64)
                     .required(),
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
                        .custom(isValidPhoneNumber, "phoneNumber")
                        .messages({
                            "any.custom": "Your phone number is invalid!"
                        }),
        username: joi
                     .string()
                     .alphanum()
                     .min(4)
                     .max(40)
                     .lowercase()
                     .when("emailAddress", {
                        is: "",
                        then: joi.when("phoneNumber", {
                            is: "",
                            then: joi.required()
                        })
                     }),
        password: joi
                     .string()
                     .min(8)
                     .max(64)
                     .required()
                     .custom(passwordStrength, "password")
                     .messages({
                        "any.custom": "Your password strength is not strong enough!"
                     })
    }
);

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
                    .custom(isValidPhoneNumber, "phoneNumber")
                    .messages({
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

// refactor:
const verify = joi.object({
    verificationCode: joi
                         .string()
                         .required()
});

module.exports = {
    register,
    login,
    verify
};