const joi = require("../../schemas/auth.js");

const User = require("../../models/User.js");

const { generateVerificationCode } = require("../../lib/functions/utils/generateVerificationCode.js");

const Nodemailer  = require("../../lib/classes/Nodemailer.js")
    , Messagebird = require("../../lib/classes/Messagebird.js");

function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/verify", async (req, rep) => {
        try {   
            await joi.verify.validateAsync(req.body);

            const {
                verificationCode
            } = req.body;

            const user = await User.findOne({ "verificationCode.code.value": verificationCode });

            if(!user) return rep
                                .status(404)
                                .send("Unable to verify your account! A user with that verificationCode does not exist or is invalid!");

            if(user.isVerified === true) return rep
                                                   .status(409)
                                                   .send("Your account is already verified!");

            const {
                createdAt,
                expiresAt
            } = user.verification.code;

            if(Math.floor(Math.abs(createdAt - expiresAt) / 3.6e6) >= 24) {
                await user.updateOne({
                    "verification.code.value": generateVerificationCode(),
                    createdAt: new Date(),
                    expiresAt: new Date(new Date().setHours(new Date().getHours() + 24))
                }, {
                    new: true
                });

                const emailAddress = user.emailAddress
                    , phoneNumber = user.phoneNumber.number
                    , verificationCode = user.verification.code.value;

                if(!emailAddress && !phoneNumber) return rep
                                                            .status(502)
                                                            .send("Unable to send you a verification code, it looks like you're missing either an emailAddress or phoneNumber!");

                if(emailAddress) await Nodemailer.sendVerificationCode(emailAddress, verificationCode);
                
                if(phoneNumber) await Messagebird.sendVerificationCode(phoneNumber, verificationCode);

                return rep
                          .status(406)
                          .send("it looks like your verification has expired! Don't worry :3 we sent you a new one!");
            };

            await user.updateOne({
                "permissionLevel": 1,
                "verification.isVerified": true,
                "verification.code": {
                    value: user.verification.code.value,
                    createdAt: new Date(),
                    expiresAt: new Date(new Date().setHours(new Date().getHours() + 24))
                },
                $unset: {
                    "verification.code": ""
                }
            });

            rep
               .status(200)
               .send("Your account was successfully verified!");
        } catch(err) {
            if(err.isJoi === true) rep
                                      .status(422)
                                      .send('Invalid Form Body!');
            console.error(err);

            rep.send(500);
        };
    });

    done();
};

module.exports = route;