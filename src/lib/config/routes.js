const register = require("../../routes/auth/register.js");

module.exports = (fastify) => {
    fastify
           .register(register);
};