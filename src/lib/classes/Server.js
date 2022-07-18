const mongoose = require("mongoose");

const fastify = require("fastify")({
    logger: true
});

class Server {
    constructor({
        mongodbURI
    }) {
        this.mongodbURI = mongodbURI;
    };

    async start() {
        try {
            console.log("Attempting to connect to MongoDB.....");

            await mongoose.connect(this.mongodbURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });

            console.log("Successfully connected to MongoDB!");
        } catch(err) {
            console.error(`An error has occured while attempting to connect to MongoDB! => ${err}`);
        };

        try {
            console.log("Attempting to start the server.....");

            console.log("Loading fastify plugins.....");

            // Default fastify plugins.
            const cookie = require("@fastify/cookie");

            fastify
                   .register(cookie, {
                       secret: process.env.TOKEN_KEY,
                       httpOnly: false
                   });
            
            // Custom fastify plugins, currently not in use.
            // require("../../plugins")(fastify);

            console.log("Successfully loaded fastify plugins!");

            // Routes
            // Auth:
            console.log("Loading routes.....");

            require("../../routes/auth.js")(fastify);

            console.log("Successfully loaded routes!");

            console.log("Attempting to start the server now.....");

            fastify.listen({
                port: process.env.FASTIFY_SERVER_PORT || 3000
            });

            console.log("Successfully started the server!");
        } catch(err) {
            console.error(`An error has occured while attempting to start the server! => ${err}`);
        };
    };

    stop() {
        process.exit();
    };
};  

module.exports = Server;