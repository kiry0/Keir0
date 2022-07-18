const { randomBytes } = require("crypto");

const generatePasswordResetCode = () => {
    return randomBytes(6).toString("base64");
};

module.exports = generatePasswordResetCode;