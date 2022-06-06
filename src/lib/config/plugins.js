const cors = require("@fastify/cors");

module.exports = (fastify) => {
    fastify.register(cors);
};