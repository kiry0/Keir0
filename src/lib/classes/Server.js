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
        mongoose.connect(this.mongodbURI,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                // useFindAndModify: false, // unsupported option.
                // useCreateIndex: true // unsupported
            }, (err) => {
            console.log('Attempting to connect to MongoDB.....');

            if(err) throw new Error(`An error has occured, unable to connect to MongoDB! => ${err}`);

            console.log('Successfully connected to MongoDB!');

            try {
                console.log('Attempting to start the server.....');
                
                // require('../../config/middlewares.js')(this.app);
        
                require("../config/routes.js")(fastify);
                // fastify.register(require("../../routes/user.test.js"));

                fastify.listen(process.env.FASTIFY_SERVER_PORT);

                console.log('Successfully started the server!');

            } catch(err) {
                throw new Error(`An error has occured, unable to start the server! => ${err}`);
            };
        });
    };

    stop() {
        process.exit();
    };
};  

module.exports = Server;