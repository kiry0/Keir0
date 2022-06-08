const User = require("../models/User.js");

const { 
    register,
    login,
    verify
} = require('../schemas/auth.js');

const bcrypt = require("bcrypt")
    , crypto = require("crypto");

const Nodemailer = require("../lib/classes/Nodemailer.js")
    , Messagebird = require("../lib/classes/Messagebird.js");

const nodemailer = new Nodemailer()
    , messagebird = new Messagebird();

// TODO: Captcha.
// TODO: Rate-limiting/perms
// TODO: Diagnostic system
// TODO: Token authentication instead of sessions.
function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/register", async (req, rep) => {
        try {
            await register.validateAsync(req.body);
 
            const {
                firstName,
                lastName,
                emailAddress,
                phoneNumber,
                username,
                password 
            } = req.body;

            const doesUserExist = await User.findOne({ $or:[{ emailAddress }, { phoneNumber }, { username }]}) ? true : false;

            if(doesUserExist) return rep    
                                        .status(409)
                                        .send('A user with that emailAddress/username/phoneNumber already exists!');

            const token = crypto
                                .randomBytes(32)
                                .toString('hex')
                , permissionLevel = 1
                , verificationCode = crypto
                                           .randomBytes(16)
                                           .toString('hex');

            const hashedPassword = await bcrypt.hash(password, 8)
                , hashedToken = await bcrypt.hash(token, 8);

            user = new User(
                {
                    firstName,
                    lastName,
                    emailAddress,
                    phoneNumber,
                    username,
                    password: hashedPassword,
                    token: hashedToken,
                    permissionLevel,
                    verificationCode
                }
            );

            await user.save();

            await nodemailer.sendMail({
                from: "detercarlhansen@gmail.com",
                to: emailAddress,
                subject: "Verify your account.",
                text: `You're one one step closer to being able to use our service, verify your account via the verification code: ${verificationCode}`
            });

            await messagebird.sendMessage({
                'originator': 'newsl',
                'recipients': [
                  `+45${ phoneNumber }`
              ],
                'body': `You're one one step closer to being able to use our service, verify your account via the verification code: ${verificationCode}`
            });

            rep
               .status(201)
               .send(user);
        } catch(err) {
            if(err.isJoi === true) rep
                                      .status(422)
                                      .send('Invalid Form Body!');

            console.error(err);

            rep.send(500);
        };
    }); 

    fastify.post("/api/v1/test/auth/login", async (req, rep) => {
        try {
            await login.validateAsync(req.body);

            const {
                emailAddress,
                phoneNumber,
                username,
                password
            } = req.body;

            const user = (await User.find({ $or:[{ emailAddress }, { phoneNumber }, { username }]}))[0];

            if(!user) return rep.send(404);

            if(!user.isVerified) return rep.send(401);

            const doesPasswordMatch = await bcrypt.compare(password, user.password) ? true : false;

            if(!doesPasswordMatch) return rep.send(401); 

            rep.send(200);
        } catch(err) {
            if(err.isJoi === true) res.status(422).send('Invalid Form Body!');
        
            console.error(err);
    
            rep.send(500);
        };
    });

    fastify.post("/api/v1/test/auth/verify", async (req, rep) => {
        try {
            await verify.validateAsync(req.body);

            const {
                verificationCode
            } = req.body;

            const user = await User.find({ verificationCode });

            const doesUserExist = user ? true : false;

            if(!doesUserExist) return rep.send(404);

            if(user.isVerified === true) return rep
                                                   .status(409)
                                                   .send("Your account is already verified!");

            const updatedDoc = await User.findOneAndUpdate({
                verificationCode
            }, {
                'isVerified': true,
                $unset: {
                    verificationCode: ""
                }
            }, {
                new: true
            }).exec();

            rep
               .status(200)
               .send(updatedDoc);
        } catch(err) {
            console.error(err);
        };
    });
    
    // TODO: Delete/Ban user route.
    
    done();
};

module.exports = route;