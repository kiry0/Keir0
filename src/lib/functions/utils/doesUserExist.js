const User = require("../../../models/User.js");

const APIError = require("../../classes/APIError.js");

const doesUserExist = (...args) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({ $or: args });

            const {
                emailAddress,
                phoneNumber: { number } = {},
                username
            } = user;

            if(!user) resolve(false);

            const errorMessages = [];

            if(user?.emailAddress === emailAddress) errorMessages.push({ message: "{ emailAddress } is already taken!" });

            if(user?.phoneNumber.number === number) errorMessages.push({ message: "{ phoneNumber } is already taken!" });

            if(user?.username === username) errorMessages.push({ message: "{ username } is already taken!" });
            
            reject(new APIError(JSON.stringify(errorMessages), 409));
        } catch(error) {
            reject(error);
        };
    });
};

module.exports = doesUserExist;