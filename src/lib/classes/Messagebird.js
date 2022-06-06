const messagebird = require("messagebird")("XiGooKhJ2AYIRbJa8Jf3tRqvY");

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