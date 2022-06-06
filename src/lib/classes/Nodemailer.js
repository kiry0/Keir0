const nodemailer = require("nodemailer");

class Nodemailer {
    constructor(transporter) {
        this.transporter = nodemailer.createTransport(
            {
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: "detercarlhansen@gmail.com",
                    pass: "txintxyjignlrhwv"
                }
            }
        );
    };

    async sendMail(mail) {
        try {
            await this.transporter.sendMail(mail);
        } catch(error) {
            if(error) console.error(error);

            return;
        };
    };
};

module.exports = Nodemailer;