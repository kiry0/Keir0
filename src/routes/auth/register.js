const joi = require("../../schemas/auth.js");
const { parsePhoneNumber } = require("libphonenumber-js");

const User = require("../../models/User.js");

const bcrypt = require("bcryptjs");

const generateVerificationCode = require("../../lib/functions/utils/generateVerificationCode.js");

const Nodemailer  = require("../../lib/classes/Nodemailer.js")
    , Messagebird = require("../../lib/classes/Messagebird.js");

function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/register", async (req, rep) => {
        try {
            await joi.register.validateAsync(req.body);
 
            const {
                firstName,
                middleName,
                lastName,
                emailAddress,
                phoneNumber,
                username,
                password
            } = req.body;

            const {
                countryCallingCode,
                nationalNumber,
                number
            } = parsePhoneNumber(phoneNumber);

            const hashedPassword = bcrypt.hashSync(password, 8)
                , verificationCode = generateVerificationCode();

            await User.create(
                {
                    firstName,
                    middleName,
                    lastName,
                    emailAddress,
                    phoneNumber: {
                        countryCallingCode,
                        nationalNumber,
                        number
                    },
                    username,
                    password: hashedPassword,
                    verification: {
                        code: {
                            value: verificationCode
                        }
                    }
                }
            );

            if(emailAddress) await Nodemailer.sendVerificationCode(emailAddress, verificationCode);
            
            if(number) await Messagebird.sendVerificationCode(number, verificationCode);

            rep
               .status(201)
               .send("Successfully registered!");
        } catch(err) {
            if(err.isJoi === true) return rep
                                             .status(422)
                                             .send(err.details[0].message);

            if(err.name === "MongoServerError" && err.code === 11000) return rep
                                                                                .status(409)
                                                                                .send("A user with that emailAddress/username/phoneNumber already exists!");
            
            console.error(err);

            rep.send(500);
        };
    });

    done();
};

module.exports = route;