const joi = require('joi');

const passwordStrength = require("../lib/functions/passwordStrength.js");

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
        // TODO: Proper phoneNumber validation for valid/invalid phone numbers.
        phoneNumber: joi
                        .number()
                        .when("emailAddress", {
                            is: "",
                            then: joi
                                     .required()
                        }),
        username: joi
                     .string()
                     .alphanum()
                     .min(4)
                     .max(40)
                     .lowercase()
                     .required(),
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

// refactor: login/verify schema.
const login = joi.object({
    emailAddress: joi
                     .string()
                     .email()
                     .lowercase(),
    phoneNumber: joi
                    .string()
                    .min(8)
                    .pattern(/^\d+$/),
    username: joi
                 .string()
                 .min(4)
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
                         .required()
});

module.exports = {
    register,
    login,
    verify
};