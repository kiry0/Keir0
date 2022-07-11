const { 
    register,
    login,
    verify
} = require('../schemas/auth.js');

const User = require("../models/User.js");

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
function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/register", async (req, rep) => {
        try {
            await register.validateAsync(req.body);
 
            const {
                firstName,
                lastName,
                emailAddress,
                username,
                phoneNumber,
                password 
            } = req.body;

            const doesUserAlreadyExist = (await User.find({
                $or: [{ emailAddress }, { phoneNumber }, { username }]
            })).length >= 1 ? true : false;
            
            if(doesUserAlreadyExist) return rep    
                                               .status(409)
                                               .send('A user with that emailAddress/username/phoneNumber already exists!');

            const {
                countryCallingCode,
                nationalNumber,
            } = phoneNumber
                , number = `+${countryCallingCode}${nationalNumber}`;

            const hashedPassword = await bcrypt.hash(password, 8)
                , permissionLevel = 1
                , verificationCode = crypto
                                           .randomBytes(16)
                                           .toString('hex');

            await User.create(
                {
                    firstName,
                    lastName,
                    emailAddress,
                    phoneNumber: {
                        countryCallingCode,
                        nationalNumber,
                        number
                    },
                    username,
                    password: hashedPassword,
                    permissionLevel,
                    verificationCode: {
                        code: verificationCode
                    }
                }
            );

            // await nodemailer.sendMail({
            //     from: "_auth.js@gmail.com",
            //     to: emailAddress,
            //     subject: "Verify your account.",
            //     text: `You're one one step closer to being able to use our service, verify your account via the verification code: ${verificationCode}`
            // });

            // TODO:
            // await messagebird.sendMessage({
            //     originator: '_auth.js',
            //     recipient: phoneNumber
            //     body: `You're one one step closer to being able to use our service, verify your account via the verification code: ${verificationCode}`
            // });

            // await messagebird.sendMessage({
            //     'originator': '_auth.js',
            //     'recipients': [
            //       `+45${ phoneNumber }`
            //   ],
            //     'body': `You're one one step closer to being able to use our service, verify your account via the verification code: ${verificationCode}`
            // });

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

    fastify.post("/api/v1/test/auth/login", async (req, rep) => {
        try {
            const cookies = req.cookies;
            
            if(cookies.token) {
                const isTokenCookieValid = req.unsignCookie(cookies.token).valid;

                if(!isTokenCookieValid) return rep
                                                  .status(401)
                                                  .send("It looks like your cookie was tampered with while you're still logged in, to fix this you'll need to log out! :)");
                
                cookies.token = req.unsignCookie(cookies.token).value;

                const isJwtValid = jwt.verify(cookies.token, process.env.TOKEN_KEY);

                if(!isJwtValid) return rep
                                          .status(401)
                                          .send("It looks like your jwt was tampered with while you're still logged in, to fix this you'll need to log out! :)");

                const payload = jwt.decode(cookies.token);
            
                if(payload.isLoggedIn === true) return rep
                                                          .status(401)
                                                          .send("You're already logged in!");
            };

            await login.validateAsync(req.body);

            const {
                emailAddress,
                phoneNumber,
                username,
                password
            } = req.body;

            const user = (await User.find({
                $or: [{ emailAddress }, { phoneNumber }, { username }]
            }))[0];

            if(!user) return rep
                                .status(404)
                                .send("Unable to log you in! A user with that emailAddress/phoneNumber/username does not exist!");

            if(!user.isVerified) return rep
                                           .status(401)
                                           .send("You must be verified to log in!");

            const doesPasswordMatch = await bcrypt.compare(password, user.password) ? true : false;
            
            if(!doesPasswordMatch) return rep
                                             .status(401)
                                             .send("Incorrect password!"); 

            const refreshToken = jwt.sign({
                user_id: user._id,
            }, process.env.TOKEN_KEY, {
                expiresIn: 60 * 60 * 24 * 61 // 2MNTHS
            })
                , token = jwt.sign({
                    user_id: user._id,
                    permissionLevel: user.permissionLevel,
                    isLoggedIn: true
                }, process.env.TOKEN_KEY, {
                    expiresIn: 60 * 60 * 2 // 2HRS
                });

            rep
                .setCookie("refreshToken", refreshToken, {
                    path: "/",
                    signed: true,
                    maxAge: 60 * 60 * 24 * 61 // 2MNTHS
                })
               .setCookie("token", token, {
                   path: "/",
                   signed: true,
                   maxAge: 60 * 60 * 2 // 2HRS
               })
               .status(200)
               .send("Successfully logged in!");
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

            const user = (await User.find({ "verificationCode.code": verificationCode }))[0];

            const doesUserExist = user ? true : false;

            if(!doesUserExist) return rep
                                         .status(404)
                                         .send("Invalid verification code!");

            if(user.isVerified === true) return rep
                                                   .status(409)
                                                   .send("Your account is already verified!");

            const date = {
                verificationCodeGeneratedAt: new Date(user.verificationCode.generatedAt.toUTCString().slice(0, -4)),
                now: new Date(new Date().toUTCString().slice(0, -4))
            };

            if(Math.abs(date.now - date.verificationCodeGeneratedAt) / 1000 % 60 / 60 % 60 / 60 % 24 >= 24) {
                const user = await User.findOneAndUpdate({
                        'verificationCode.code': verificationCode
                    }, {
                        'verificationCode.code': crypto
                                                .randomBytes(16)
                                                .toString('hex'),
                        "verificationCode.generatedAt": Date.now()
                    }, {
                        new: true
                    }).exec();
                        
                const {
                    emailAddress,
                    phoneNumber
                } = user;

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
                   .status(200)
                   .send("it looks like your verification has expired! Don't worry :3 we sent you a new one!");
            };
            
            await User.findOneAndUpdate({
                "verificationCode.code": verificationCode
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
               .send("Your account was successfully verified!");
        } catch(err) {
            if(err.isJoi === true) rep
                                      .status(422)
                                      .send('Invalid Form Body!');
            console.error(err);

            rep.send(500);
        };
    });
    
    fastify.post("/api/v1/test/auth/logout", (req, rep) => {
        // TODO: Destroy refreshToken
        try {
            const cookies = req.cookies;
            
            if(!cookies.token) return rep
                                         .status(404)
                                         .send("Unable to log you out, perhaps you're already logged out!");

            const isTokenCookieValid = req.unsignCookie(cookies.token).valid;                 

            if(!isTokenCookieValid) return rep
                                              .status(401)
                                              .send("It looks like your cookie was tampered with!");

            cookies.token = req.unsignCookie(cookies.token).value;

            const isJwtValid = jwt.verify(cookies.token, process.env.TOKEN_KEY);
                            
            if(!isJwtValid) return rep
                                      .status(401)
                                      .send("It looks like your jwt was tampered with!");

            const payload = jwt.decode(cookies.token);

            if(payload.isLoggedIn === false) return rep
                                                       .status(401)
                                                       .send("Whoops! It looks like you're already logged out!");
            rep
               .clearCookie("refreshToken", {
                   path: "/"             
               })
               .clearCookie("token", {
                   path: "/"
               })
               .status(200)
               .send("Successfully logged out!");

        } catch(err) {
            if(err) console.error(err);

            rep.send(500);
        };
    });

    fastify.post("/api/v1/test/auth/refreshToken", async (req, rep) => {
        const { 
            refreshToken
        } = req.cookies;

        const isRefreshTokenCookieValid = req.unsignCookie(refreshToken).valid;                 

        if(!isRefreshTokenCookieValid) return rep
                                          .status(401)
                                          .send("It looks like your cookie was tampered with! Unable to generate you a new jwt!");

        const refreshTokenValue = req.unsignCookie(refreshToken).value;

        const isRefreshJwtValid = jwt.verify(refreshTokenValue, process.env.TOKEN_KEY);
        
        if(!isRefreshJwtValid) rep
                                  .status(401)
                                  .send("It looks like your jwt was tampered with!");

        const decodedJwtToken = jwt.decode(refreshTokenValue);

        const user = await User.findById(decodedJwtToken.user_id);

        if(!user) rep
                     .status(500)
                     .send("Unknown error has occured, unable to find user with that user_.id!")
        
        const newRefreshToken = jwt.sign({
            user_id: user._id
        }, process.env.TOKEN_KEY, {
            expiresIn: 60 * 60 * 24 * 61 // 2MNTHS
        })
            , newToken = jwt.sign({
            user_id: user._id,
            permissionLevel: user.permissionLevel,
            isLoggedIn: true
        }, process.env.TOKEN_KEY, {
            expiresIn: 60 * 60 * 2 // 2HRS
        });
            
        rep
           .setCookie("refreshToken", newRefreshToken, {
               path: "/",
               signed: true,
               maxAge: 60 * 60 * 24 * 61 // 2MNTHS
           })
             .setCookie("token", newToken, {
                path: "/",
                signed: true,
                maxAge: 60 * 60 * 2 // 2HRS
             })
             .status(200)
             .send("Successfully regenerated a new token!");
    });

    done();
};
 
module.exports = route;