"use strict";   

const mongoose = require("mongoose")
    , fastify = require("fastify")(
        { 
            logger: true 
        }
    );

class Server {
    constructor({
        mongodbURI
    }) {
        this.mongodbURI = mongodbURI;
    };

    start() {
        return new Promise(async (resolve, reject) => {
            try {
                console.log('Attempting to connect to MongoDB.....');

                await mongoose.connect(this.mongodbURI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });

                console.log('Successfully connected to MongoDB!');

                console.log('Attempting to start the server.....');
                
                require("../config/plugins.js")(fastify);
            
                require("../config/routes.js")(fastify);
    
                await fastify.listen({
                    port: process.env.FASTIFY_SERVER_PORT || 3000
                });
    
                console.log('Successfully started the server!');

                resolve("Everything booted up smoothly you're good to go!");
            } catch(error) {
                if(error) reject(error);
            };
        });
    };

    stop() {
        process.exit();
    };
};  

module.exports = Server;