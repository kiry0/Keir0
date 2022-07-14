const register = require("../../routes/auth/register.js")
    , logIn = require("../../routes/auth/logIn.js")
    , verify = require("../../routes/auth/verify.js");

module.exports = (fastify) => {
    fastify
           .register(register)
           .register(logIn)
           .register(verify);
};