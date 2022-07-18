const {
    isValidNumber,
    isPossiblePhoneNumber
} = require("libphonenumber-js");

const isPhoneNumberValid = (phoneNumber, helpers) => { 
    const isPhoneNumberValid = isValidNumber(phoneNumber) || isPossiblePhoneNumber(phoneNumber);

    if(!isPhoneNumberValid) return helpers.error("any.custom");

    return phoneNumber;
};

module.exports = isPhoneNumberValid;