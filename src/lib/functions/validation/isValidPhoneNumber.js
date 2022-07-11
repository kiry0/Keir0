const {
    isValidNumber,
    isPossiblePhoneNumber
} = require("libphonenumber-js");

const isValidPhoneNumber = (value, helpers) => {
    const {
        countryCallingCode,
        nationalNumber,
    } = value;

    value.number = `+${countryCallingCode}${nationalNumber}`;

    const phoneNumber = value.number;

    const isValidPhoneNumber = isValidNumber(phoneNumber) || isPossiblePhoneNumber(phoneNumber);

    if(!isValidPhoneNumber) return helpers.error("any.custom");

    return value;
};

module.exports = isValidPhoneNumber;