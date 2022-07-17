const User = require("../../models/User.js");

const jwt = require("jsonwebtoken");

function route(fastify, options, done) {
    // TODO: Additional security for refreshing tokens.
    fastify.post("/api/v1/test/auth/refreshToken", async (req, rep) => {
        const { 
            refreshToken
        } = req.cookies;

        const isRefreshTokenCookieValid = req.unsignCookie(refreshToken).valid;                 

        if(!isRefreshTokenCookieValid) return rep
                                                 .status(401)
                                                 .send("It looks like your cookie was tampered with! Unable to generate you a new jwt!");

        const refreshTokenValue = req.unsignCookie(refreshToken).value;

        const isRefreshTokenValid = jwt.verify(refreshTokenValue, process.env.TOKEN_KEY);
        
        if(!isRefreshTokenValid) rep
                                  .status(401)
                                  .send("It looks like your refreshToken was tampered with! Unable to generate you a new jwt!");

        const decodedRefreshToken = jwt.decode(refreshTokenValue);

        const {
            user_id
        } = decodedRefreshToken;

        const user = await User.findById(user_id);

        if(!user) rep
                     .status(404)
                     .send("Unknown error has occured, unable to find a user with that user_.id!")
        
        const newRefreshToken = jwt.sign({
            user_id: user._id
        }, process.env.TOKEN_KEY, {
            expiresIn: 60 * 60 * 24 * 30 // 1MNTH
        })
            , newToken = jwt.sign({
            user_id: user._id,
            permissionLevel: user.permissionLevel
        }, process.env.TOKEN_KEY, {
            expiresIn: 60 * 60 * 2 // 2HRS
        });
            
        rep
           .setCookie("refreshToken", newRefreshToken, {
               path: "/",
               signed: true,
               maxAge: 60 * 60 * 24 * 30 // 1MNTH
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