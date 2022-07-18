const messagebird = require("messagebird")(process.env.MESSAGEBIRD_API_KEY);

class Messagebird {
    constructor() {

    };

    sendMessage(params) {
        return new Promise((resolve, reject) => {
            messagebird.messages.create(params, (error, response) => {
                if(error) return reject(error);

                resolve(response);
            });
        });
    };

    sendVerificationCode(recipients, verificationCode) {
        return new Promise((resolve, reject) => {        
            messagebird.messages.create({
                originator: "Keir0",
                recipients,
                body: `We need to verify your identity, this verification code will expire in 24 hours: ${verificationCode}`
            }, (error, response) => {
                if(error) return reject(error);

                resolve(response);
            });
        });
    };
};

module.exports = new Messagebird;