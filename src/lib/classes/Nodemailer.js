const nodemailer = require("nodemailer");

class Nodemailer {
    constructor() {
        this.transporter = nodemailer.createTransport(
            {
                host: "smtp.gmail.com",
                port: 587,
                auth: {
                    user: "detercarlhansen@gmail.com",
                    pass: process.env.NODEMAILER_USER_PASSWORD
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