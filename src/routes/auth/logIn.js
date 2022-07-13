const joi = require("../../schemas/auth");

const User = require("../../models/User.js");

const bcrypt = require("bcryptjs")
    , jwt = require("jsonwebtoken");

function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/login", async (req, rep) => {
        try {
            let { token } = req.cookies;
            
            if(token) return rep.send(200);

            await joi.login.validateAsync(req.body);

            const {
                emailAddress,
                phoneNumber,
                username,
                password
            } = req.body;

            const user = await User.findOne({
                $or: [{ emailAddress }, { "phoneNumber.number": phoneNumber }, { username }]
            });

            if(!user) return rep
                                .status(404)
                                .send("Unable to log you in! A user with that emailAddress/phoneNumber/username does not exist!");

            const doesPasswordMatch = await bcrypt.compare(password, user.password) ? true : false;
            
            if(!doesPasswordMatch) {
                // TODO: Compare a dummy hash to prevent timing attacks.
                
                return rep
                          .status(401)
                          .send("Incorrect password!");
            };

            const refreshToken = jwt.sign({
                user_id: user._id,
            }, process.env.TOKEN_KEY, {
                expiresIn: 60 * 60 * 24 * 30 // 1MNTH
            })
                , bearer = jwt.sign({
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
                    maxAge: 60 * 60 * 24 * 30 // 1MNTH
                })
               .setCookie("token", bearer, {
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

    done();
};

module.exports = route;