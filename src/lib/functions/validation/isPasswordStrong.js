const zxcvbn = require("zxcvbn");

const isPasswordStrong = (value, helpers) => {
    if(zxcvbn(value).score <= 2) return helpers.error("any.custom");

    return value;
};

module.exports = isPasswordStrong;