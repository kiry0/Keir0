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

    async sendMail(params) {
        try {
            await this.transporter.sendMail(params);
        } catch(error) {
            if(error) console.error(error);

            return;
        };
    };

    async sendVerificationCode(recipientEmailAddress, verificationCode) {
        const ORIGINATOR_EMAIL_ADDRESS = "_auth.js@gmail.com"; // Replace with company email address.
        
        const params = {
            from: ORIGINATOR_EMAIL_ADDRESS,
            to: recipientEmailAddress,
            subject: "Verify your account.",
            text: `We need to verify your identity, this verification code will expire in 24 hours: ${verificationCode}`
        };

        try {
            await this.transporter.sendMail(params);
        } catch(error) {
            if(error) console.error(error);

            return;
        };
    };
};

module.exports = Nodemailer;