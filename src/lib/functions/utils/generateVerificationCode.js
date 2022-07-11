const { randomBytes } = require("crypto");

const generateVerificationCode = () => {
    return randomBytes(6)
                         .toString("base64");
};

module.exports = generateVerificationCode;