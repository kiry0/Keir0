const {
    isValidNumber,
    isPossiblePhoneNumber
} = require("libphonenumber-js");

const isValidPhoneNumber = (value, helpers) => {
    const phoneNumber = value;
 
    const isValidPhoneNumber = isValidNumber(phoneNumber) || isPossiblePhoneNumber(phoneNumber);

    if(!isValidPhoneNumber) return helpers.error("any.custom");

    return value;
};

module.exports = isValidPhoneNumber;