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
};

module.exports = Messagebird;