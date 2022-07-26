const logInSchema = require("../../schemas/auth/logIn.js");

const doesUserAlreadyExist = require("../../lib/functions/utils/doesUserAlreadyExist.js");

const APIError = require("../../lib/classes/APIError.js");

const User = require("../../models/User.js");

const bcrypt = require("bcryptjs")
    , jwt = require("jsonwebtoken");


function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/logIn", async (req, rep) => {
        try {
            req.local = { body: await logInSchema.validateAsync(req.body) }
        } catch(error) {
            // Emit an error event.
            console.error(error);

            if(error.isJoi === true) return rep
                                               .status(422)
                                               .send(error.details);

            return rep
                      .status(500)
                      .send(error);
        };

        try {
            const {
                emailAddress,
                phoneNumber: { number } = {},
                username
            } = req.local.body;

            req.local.doesUserAlreadyExist = await doesUserAlreadyExist({ emailAddress }, { "phoneNumber.number": number }, { username });

            if(!req.local.doesUserAlreadyExist) throw new APIError("Incorrect user credentials combination!");

            // req.local.user = 
        } catch(error) {
            // Emit an error event.
            if(error.isJoi === true) return rep
                                               .status(422)
                                               .send(error.message);

            if(error.name === "APIError") return rep
                                                    .status(error.statusCode)
                                                    .send(error.message);
                                                    
            return rep
                      .status(500)
                      .send(error);
        };

        try {
            const doesPasswordMatch = await bcrypt.compare(password, user.password) ? true : false;
        } catch(error) {

        };

        //     const doesPasswordMatch = await bcrypt.compare(password, user.password) ? true : false;
            
        //     if(!doesPasswordMatch) {
        //         // TODO: Compare a dummy hash to prevent timing attacks.
                
        //         return rep
        //                   .status(401)
        //                   .send("Incorrect password!");
        //     };

        //     const refreshToken = jwt.sign({
        //         user_id: user._id,
        //     }, process.env.TOKEN_KEY, {
        //         expiresIn: 60 * 60 * 24 * 30 // 1MNTH
        //     })
        //         , bearer = jwt.sign({
        //             user_id: user._id,
        //             permissionLevel: user.permissionLevel,
        //             isLoggedIn: true
        //         }, process.env.TOKEN_KEY, {
        //             expiresIn: 60 * 60 * 2 // 2HRS
        //         });

        //     rep
        //         .setCookie("refreshToken", refreshToken, {
        //             path: "/",
        //             signed: true,
        //             maxAge: 60 * 60 * 24 * 30 // 1MNTH
        //         })
        //        .setCookie("token", bearer, {
        //            path: "/",
        //            signed: true,
        //            maxAge: 60 * 60 * 2 // 2HRS
        //        })
        //        .status(200)
        //        .send("Successfully logged in!");
        // } catch(err) {
        //     if(err.isJoi === true) res
        //                               .status(422)
        //                               .send('Invalid Form Body!');
        
        //     console.error(err);
    
        //     rep.send(500);
        // };
    });

    done();
};

module.exports = route;