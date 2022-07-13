const register = require("../../routes/auth/register.js")
    , logIn = require("../../routes/auth/logIn.js");

module.exports = (fastify) => {
    fastify
           .register(register)
           .register(logIn);
};