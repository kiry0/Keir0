const User = require("../../models/User.js");

const generatePasswordResetCode = require("../../lib/functions/utils/generatePasswordResetCode.js");

const Nodemailer  = require("../../lib/classes/Nodemailer.js")
    , Messagebird = require("../../lib/classes/Messagebird.js");

const bcrypt = require("bcryptjs");

function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/requestPasswordReset", async (req, rep) => {
        try {
            const {
                emailAddress,
                phoneNumber,
                username
            } = req.body;
            
            const user = await User.findOne({
                $or: [{ emailAddress }, { "phoneNumber.number": phoneNumber }, { username }]
            });
        
            if(!user) return rep
                                .status(401)
                                .send("A user with that credentials was not found!");          
                
            const passwordResetCode = generatePasswordResetCode();

            const token = {
                value: bcrypt.hashSync(passwordResetCode, 8),
                createdAt: new Date(),
                expiresAt: new Date(new Date().setHours(new Date().getHours() + 1)) // 1HR,
            };

            await user.updateOne({
                $push: {
                    "authorization.tokens.passwordReset": token
                }
            });

            if(emailAddress) {
                await Nodemailer.sendEmail(emailAddress, {
                    from: "keir0@keir0.com",
                    to: emailAddress,
                    subject: "Reset password.",
                    text: `Password reset code: ${passwordResetCode}`
                });
            };
                
            if(phoneNumber) {
                await Messagebird.sendMessage(phoneNumber, {
                    originator: "Keir0",
                    recipents: phoneNumber,
                    body: `Password reset code: ${passwordResetCode}`
                });
            };

            rep
               .status(200)
               .send("We have sent a resetPassword code to either your emailAddress/phoneNumber!");
        } catch(err) {
            if(err) console.error(err);

            rep.send(500);
        }

        // const passwordResetTokens = await Tokens.findOne({
        //     "userId": 1
        // });

        // console.log(passwordResetTokens.tokens.passwordReset);
        // } catch(err) {
        //     console.log(err);
        // };

        // if(user.tokens.passwordReset.value) {
        //     const newPasswordResetToken = generatePasswordResetToken();

        //     user.updateOne({
        //         "tokens.resetPassword.value": [
        //             {
        //                 value: newPasswordResetToken,

        //             }
        //         ],
        //     });

        //     // "tokens.resetPassword.createdAt": new Date(), // Date.now
        //     // "tokens.resetPassword.expiresAt": new Date(new Date().setHours(new Date().getHours() + 1)) // Date.now + HRS(1)

        //     if(emailAddress) await Nodemailer.sendVerificationCode(emailAddress, verificationCode);
                
        //     if(phoneNumber) await Messagebird.sendVerificationCode(phoneNumber, verificationCode);

        //     return rep
        //               .status(406)
        //               .send("it looks like you already have a verification code!");
        // };
    });
    // if(user.resetCode) resetCode.delete();
    // else check both matches.

    // const resetCode = "12345678";
    // emailAddress.send(resetCode);

    // user.save(hashedResetCode);

    // bcrypt.compare(resetCode, hashedResetCode);

    // if(!same) return error;

    // user.update(password);

    done();
};

module.exports = route;