const register = require("../../routes/auth/register.js")
    , logIn = require("../../routes/auth/logIn.js")
    , verify = require("../../routes/auth/verify.js")
    , logOut = require("../../routes/auth/logOut.js")
    , refreshToken = require("../../routes/auth/refreshToken.js")
    , requestPasswordReset = require("../../routes/auth/requestPasswordReset.js");

module.exports = (fastify) => {
    fastify
           .register(register)
           .register(logIn)
           .register(verify)
           .register(logOut)
           .register(refreshToken)
           .register(requestPasswordReset);
};