const register             = require("../controllers/auth/register.js")
    , logIn                = require("../controllers/auth/logIn.js")
    , verify               = require("../controllers/auth/verify.js")
    , logOut               = require("../controllers/auth/logOut.js")
    , refreshToken         = require("../controllers/auth/refreshToken.js")
    , requestPasswordReset = require("../controllers/auth/requestPasswordReset.js");
    // , resetPassword        = require("../controllers/auth/resetPassword.js");

module.exports = (fastify) => {
    fastify
           .register(register)
           .register(logIn)
           .register(verify)
           .register(logOut)
           .register(refreshToken)
           .register(requestPasswordReset);
           // .register(resetPassword);
};