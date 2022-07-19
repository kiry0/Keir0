const Server = require("./lib/classes/Server.js");

require('dotenv').config(
    {
        path: "../.env"
    }
);

const Service = require("./lib/classes/Service.js");

const nodemailer  = require("./lib/classes/Nodemailer.js")
    , messagebird = require("./lib/classes/Messagebird.js");

const server = new Server({
    mongodbURI: process.env.MONGODB_URI
});

server
      .start();

const userRegister = (user) => {
    const {
        emailAddress,
        phoneNumber: { number } = {},
        verification: { code: { value } = {} }
    } = user;

    if(emailAddress) nodemailer.sendVerificationCode(emailAddress, value);

    if(number) messagebird.sendVerificationCode(number, value);
};

Service.on("userRegister", userRegister);