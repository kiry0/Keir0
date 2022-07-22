const zxcvbn = require("zxcvbn");

const isPasswordStrong = (password, helpers) => {
    if(zxcvbn(password).score <= 2) return helpers.error("any.custom");

    return password;
};

module.exports = isPasswordStrong;