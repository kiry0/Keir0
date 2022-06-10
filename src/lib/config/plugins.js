const cookie = require("@fastify/cookie");

module.exports = (fastify) => {
    fastify
           .register(cookie, {
               secret: process.env.TOKEN_KEY,
               httpOnly: false
           });
};