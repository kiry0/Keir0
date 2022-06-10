const user = require("../../routes/user.js");
const test = require("../../routes/test.js");

module.exports = (fastify) => {
    fastify
           .register(user)
           .register(test);

};