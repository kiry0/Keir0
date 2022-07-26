const joi = require("../../schemas/auth.js");

const User = require("../../models/User.js");

const generateRandomString = require("../../lib/functions/utils/generateRandomString.js");

const Nodemailer  = require("../../lib/classes/Nodemailer.js")
    , Messagebird = require("../../lib/classes/Messagebird.js");

function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/verify", async (req, rep) => {
        try {   
            await joi.verify.validateAsync(req.body, { 
                errors: {
                    label: false
                }
            });

            // console.log("Joi:", (await joi.verify.validateAsync(req.body)).verificationCode)

            const {
                verificationCode
            } = req.body;

            const user = await User.findOne({ "verificationCode.code.value": verificationCode });
            
            if(user.isVerified === true) return rep
                                                   .status(409)
                                                   .send("Your account is already verified!");

            // Compares the time difference of { Date.now } & { verificationCode }.
            // By default, if it's greater than 24HRS, this clause will execute.
            if(Math.floor(Math.abs(new Date() - user.verification.code.expiresAt) / 3.6e6) <= 0) {
                const newVerificationCode = generateVerificationCode();

                user = await user.updateOne({
                    "verification.code.value": newVerificationCode,
                    "verification.code.createdAt": new Date(), // Date.now
                    "verification.code.expiresAt": new Date(new Date().setHours(new Date().getHours() + 24)) // Date.now + HRS(24)
                });

                const {
                    emailAddress,
                    phoneNumber
                } = user;

                if(!emailAddress && !phoneNumber) return rep
                                                            .status(502)
                                                            .send("Unable to send you a verification code, it looks like you're missing either an emailAddress or a phoneNumber!");

                // Refactor idea: sendVerificationCode function that automatically sends to either an emailAdress or a phoneNumber.
                // & throws an error if both are null/undefined/invalid.
                if(emailAddress) await Nodemailer.sendVerificationCode(emailAddress, verificationCode);
                
                if(phoneNumber) await Messagebird.sendVerificationCode(phoneNumber, verificationCode);

                return rep
                          .status(406)
                          .send("it looks like your verificationCode has expired! Don't worry :3 we sent you a new one!");
            };

            await user.updateOne({
                "permissionLevel": 1,
                "verification.isVerified": true,
                $unset: {
                    "verification.code": ""
                }
            });

            rep
               .status(200)
               .send("Your account was successfully verified!");
        } catch(err) {
            if(err.isJoi === true) rep
                                      .status(400)
                                      .send(err.details[0].message);
            
            if(err.name === "JoiExternalError") rep
                                                   .status(err.statusCode)
                                                   .send(err.message);
            console.error(err);

            rep.send(500);
        };
    });

    done();
};

module.exports = route;

const newVerificationCode = generateRandomString();

const present = new Date();

const tomorrow = new Date(new Date().setHours(new Date().getHours() + 24));

// try {
//     await user.updateOne({
//         "verification.code.value": value,
//         "verification.code.createdAt": present,
//         "verification.code.expiresAt": tomorrow
//     });

//     const {
//         emailAddress,
//         phoneNumber: {
//             number
//         } = {}
//     } = user;

//     if(!emailAddress && !number) new JoiExternalValidationError("It looks like your verificationCode expired! We tried sending you a new one, but it looks like you're missing an emailAddress and a phoneNumber!");

//     // if(emailAddress) emailAddress.sendEmail(new verification.code);

//     // if(phoneNumber) await Messagebird.sendVerificationCode(phoneNumber, verificationCode);
// } catch(err) {

// };
// };
