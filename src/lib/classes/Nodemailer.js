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

    async sendEmail(params) {
        try {
            await this.transporter.sendMail(params);
        } catch(error) {
            if(error) console.error(error);

            return;
        };
    };

    async sendVerificationCode(to, verificationCode) {    
        try {
            await this.transporter.sendMail({
                from: "Keir0@keir0.com",
                to,
                subject: "Verify your account.",
                text: `We need to verify your account, this verification code will expire in 24 hours: ${verificationCode}`
            });
        } catch(error) {
            if(error) console.error(error);

            return;
        };
    };
};

module.exports = new Nodemailer;