const user = require("../../routes/user.js");

module.exports = (fastify) => {
    fastify.register(user);
};