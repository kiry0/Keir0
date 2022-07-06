const messagebird = require("messagebird")(process.env.MESSAGEBIRD_API_KEY);

class Messagebird {
    constructor() {

    };

    sendMessage(params) {
        messagebird.messages.create(params, (error, response) => {
            return new Promise((resolve, reject) => {
                if(error) reject(error);
                
                resolve(response);
            });
        });
    };
};

module.exports = Messagebird;