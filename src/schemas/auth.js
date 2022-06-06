const joi = require('joi');

const register = joi.object(
    {
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        emailAddress: joi.string().email().lowercase(),
        phoneNumber: joi.string().length(8).pattern(/^\d+$/).when("emailAddress", {
            is: "",
            then: joi.required()
        }),
        username: joi.string().min(4).required(),
        password: joi.string().min(9).required()
    }
);

const login = joi.object({
    emailAddress: joi.string().email().lowercase(),
    phoneNumber: joi.string().length(8).pattern(/^\d+$/),
    username: joi.string().min(4).when("emailAddress",
        { 
            is: "",
            then: joi.when("phoneNumber", {
                is: "",
                then: joi.required()
            })
        }
    ),
    password: joi.string().min(9).required()
});

const verify = joi.object({
    verificationCode: joi.string().required()
});

module.exports = {
    register,
    login,
    verify
};