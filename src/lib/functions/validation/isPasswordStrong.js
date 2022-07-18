const zxcvbn = require("zxcvbn");

const bcrypt = require("bcryptjs");

const isPasswordStrong = (password, helpers) => {
    if(zxcvbn(password).score <= 2) return helpers.error("any.custom");

    return bcrypt.hashSync(password);
};

module.exports = isPasswordStrong;