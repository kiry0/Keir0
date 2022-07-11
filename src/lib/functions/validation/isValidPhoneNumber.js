const {
    isValidNumber,
    isPossiblePhoneNumber
} = require("libphonenumber-js");

const isValidPhoneNumber = (value, helpers) => {
    const {
        countryCallingCode,
        nationalNumber
    } = value;

    value.number = `+${countryCallingCode}${nationalNumber}`;

    const phoneNumber = value;

    const number = phoneNumber.number;

    const isValidPhoneNumber = isValidNumber(number) || isPossiblePhoneNumber(number);

    if(!isValidPhoneNumber) return helpers.error("any.custom");

    return value;
};

module.exports = isValidPhoneNumber;