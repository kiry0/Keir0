const { register } = require("../../schemas/auth.js");

const User = require("../../models/User.js");

const bcrypt = require("bcryptjs");

const generateVerificationCode = require("../../lib/functions/utils/generateVerificationCode.js");

const Nodemailer  = require("../../lib/classes/Nodemailer.js")
    , Messagebird = require("../../lib/classes/Messagebird.js");

function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/register", async (req, rep) => {
        try {
            await register.validateAsync(req.body);
 
            const {
                firstName,
                middleName,
                lastName,
                emailAddress,
                username,
                phoneNumber,
                password 
            } = req.body;

            const {
                countryCallingCode,
                nationalNumber,
            } = phoneNumber;

            phoneNumber.number = `+${countryCallingCode}${nationalNumber}`;

            const number = phoneNumber.number;

            const doesUserAlreadyExist = await User.findOne({
                $or: [{ emailAddress }, { "phoneNumber.number": number }, { username }]
            }) ? true : false;
            
            if(doesUserAlreadyExist) return rep    
                                               .status(409)
                                               .send('A user with that emailAddress/username/phoneNumber already exists!');

            const hashedPassword = await bcrypt.hash(password, 8)
                , verificationCode = generateVerificationCode();

            await User.create(
                {
                    firstName,
                    middleName,
                    lastName,
                    emailAddress,
                    phoneNumber,
                    username,
                    password: hashedPassword,
                    verification: {
                        code: {
                            value: verificationCode
                        }
                    }
                }
            );

            if(emailAddress) {
                const nodemailer = new Nodemailer();
                
                await nodemailer.sendVerificationCode(emailAddress, verificationCode);
            };
            
            if(number) {
                const messagebird = new Messagebird();
                
                await messagebird.sendVerificationCode(number, verificationCode);
            };

            rep
               .status(201)
               .send("Successfully registered!");
        } catch(err) {
            if(err.isJoi === true) return rep
                                             .status(422)
                                             .send(err.details[0].message);

            console.error(err);

            rep.send(500);
        };
    });

    done();
};

module.exports = route;