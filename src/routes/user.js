const User = require("../models/User.js");

const { 
    register,
    login,
    verify
} = require('../schemas/auth.js');

const bcrypt = require("bcrypt")
    , jwt = require("jsonwebtoken")
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

            const doesUserAlreadyExist = await User.findOne({ $or:[{ emailAddress }, { phoneNumber }, { username }]}) ? true : false;

            if(doesUserAlreadyExist) return rep    
                                               .status(409)
                                               .send('A user with that emailAddress/username/phoneNumber already exists!');

            const permissionLevel = 1
                , verificationCode = crypto
                                           .randomBytes(16)
                                           .toString('hex');

            const hashedPassword = await bcrypt.hash(password, 8);

            const user = await User.create(
                {
                    firstName,
                    lastName,
                    emailAddress,
                    phoneNumber,
                    username,
                    password: hashedPassword,
                    permissionLevel,
                    verificationCode
                }
            );

            const token = jwt.sign({
                user_id: user._id,
                permissionLevel,
                isLoggedIn: false
            }, process.env.TOKEN_KEY, {
                expiresIn: "2h"
            });

            user.token = token;

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
               .setCookie("token", token, {
                   path: "/",
                   signed: true
               })
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
        // TODO: check if a user is still logged in.
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

            const cookies = req.cookies;
            
            // TODO: Refactor
            if(cookies.token) {
                const isTokenCookieValid = req.unsignCookie(cookies.token).valid;

                if(!isTokenCookieValid) return rep
                                                  .status(401)
                                                  .send("Invalid cookie!");
                
                cookies.token = req.unsignCookie(cookies.token).value;

                const isJwtValid = jwt.verify(cookies.token, process.env.TOKEN_KEY);

                if(!isJwtValid) return rep
                                          .status(401)
                                          .send("Invalid jwt!");

                const payload = jwt.decode(cookies.token);
            
                if(payload.isLoggedIn === true) return rep
                                                          .status(401)
                                                          .send("You're already logged in!");
            };

            const token = jwt.sign({
                user_id: user._id,
                permissionLevel: user.permissionLevel,
                isLoggedIn: true
            }, process.env.TOKEN_KEY, {
                expiresIn: "2h"
            });

            user.token = token;

            rep
               .setCookie("token", token, {
                   path: "/",
                   signed: true
               })
               .status(200)
               .send(user);
        } catch(err) {
            if(err.isJoi === true) res
                                      .status(422)
                                      .send('Invalid Form Body!');
        
            console.error(err);
    
            rep.send(500);
        };
    });

    // TODO: have the verification code be able to be verified via a link.
    fastify.post("/api/v1/test/auth/verify", async (req, rep) => {
        try {   
            await verify.validateAsync(req.body);

            const {
                verificationCode
            } = req.body;

            const user = (await User.find({ verificationCode }))[0];

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
            if(err.isJoi === true) rep
                                      .status(422)
                                      .send('Invalid Form Body!');
            console.error(err);
        };
    });
    
    // TODO: signout user route.

    done();
};

module.exports = route;