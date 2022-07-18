const {
    isValidNumber,
    isPossiblePhoneNumber
} = require("libphonenumber-js");

const isPhoneNumberValid = (value, helpers) => {
    const phoneNumber = value;
 
    const isPhoneNumberValid = isValidNumber(phoneNumber) || isPossiblePhoneNumber(phoneNumber);

    if(!isPhoneNumberValid) return helpers.error("any.custom");

    return value;
};

module.exports = isPhoneNumberValid;