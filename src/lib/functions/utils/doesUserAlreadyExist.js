const User = require("../../../models/User.js");

const doesUserAlreadyExist = async (...args) => {
    const user = await User.findOne({ $or: args });

    if(!user) return false;

    const {
        emailAddress = {},
        phoneNumber: { number } = {},
        username = {}
    } = user;

    return [
        emailAddress,
        number,
        username
    ];
};

module.exports = doesUserAlreadyExist;