const {
    isValidNumber,
    isPossiblePhoneNumber
} = require("libphonenumber-js");

const isValidPhoneNumber = (value, helpers) => {
    const {
        countryCallingCode,
        nationalNumber,
    } = value;

    let phoneNumber;

    if(!countryCallingCode && !nationalNumber) {
        phoneNumber = value;
    } else {
        phoneNumber = `+${countryCallingCode}${nationalNumber}`;
    };    

    const isValidPhoneNumber = isValidNumber(phoneNumber) || isPossiblePhoneNumber(phoneNumber);

    if(!isValidPhoneNumber) return helpers.error("any.custom");

    return value;
};

module.exports = isValidPhoneNumber;