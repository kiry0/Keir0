const Server = require("./lib/classes/Server.test.js");

require('dotenv').config(
    {
        path: "../.env"
    }
);

const server = new Server({
    mongodbURI: process.env.MONGODB_URI
});

server.start();