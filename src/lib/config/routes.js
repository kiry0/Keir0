const user = require("../../routes/auth.js");
const test = require("../../routes/middleware.test.js");

module.exports = (fastify) => {
    fastify
           .register(user)
           .register(test);

};