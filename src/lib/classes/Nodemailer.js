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

    sendMail(mail) {
        this.transporter.sendMail(mail);
    };
};

module.exports = Nodemailer;