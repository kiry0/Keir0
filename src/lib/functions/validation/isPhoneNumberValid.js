const {
    isValidNumber,
    isPossiblePhoneNumber,
    parsePhoneNumber
} = require("libphonenumber-js");

const isPhoneNumberValid = (phoneNumber, helpers) => { 
    const isPhoneNumberValid = isValidNumber(phoneNumber) || isPossiblePhoneNumber(phoneNumber);

    if(!isPhoneNumberValid) return helpers.error("any.custom");

    const {
        countryCallingCode,
        nationalNumber,
        number
    } = parsePhoneNumber(phoneNumber);

    phoneNumber = {
        countryCallingCode,
        nationalNumber,
        number
    };

    return phoneNumber;
};

module.exports = isPhoneNumberValid;