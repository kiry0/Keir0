const {
    isValidNumber,
    isPossiblePhoneNumber,
    parsePhoneNumber
} = require("libphonenumber-js");

const isPhoneNumberValid = (phoneNumber, helpers) => { 
    const isPhoneNumberValid = isValidNumber(phoneNumber) || isPossiblePhoneNumber(phoneNumber);

    if(!isPhoneNumberValid) return helpers.error("any.custom");

    phoneNumber = {
        countryCallingCode,
        nationalNumber,
        number
    } = parsePhoneNumber(phoneNumber);

    return phoneNumber;
};

module.exports = isPhoneNumberValid;