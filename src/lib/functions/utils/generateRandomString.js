const { randomBytes } = require("crypto");

const generateRandomString = (byteSize = 6, encoding = "base64") => {
    return randomBytes(byteSize).toString(encoding);
};

module.exports = generateRandomString;