const registerSchema       = require("../../schemas/auth/register.js")
    , doesUserAlreadyExist = require("../../lib/functions/utils/doesUserAlreadyExist.js")
    , APIError             = require("../../lib/classes/APIError")
    , generateRandomString = require("../../lib/functions/utils/generateRandomString.js")
    , bcrypt               = require("bcryptjs")
    , { parsePhoneNumber } = require("libphonenumber-js")
    , User                 = require("../../models/User.js")
    , Service              = require("../../lib/classes/Service.js");

function route(fastify, options, done) {
    fastify.post("/api/v1/auth/register", async (req, rep) => {
        try {
            req.local = { body: await registerSchema.validateAsync(req.body) };
        } catch (error) {
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
                phoneNumber,
                username
            } = req.local.body;

            req.local.doesUserAlreadyExist = await doesUserAlreadyExist({ emailAddress }, { "phoneNumber.number": phoneNumber }, { username });

            if(req.local.doesUserAlreadyExist) {
                const message = req.local.doesUserAlreadyExist.map(t => `${t} is already taken!`);

                throw new APIError(JSON.stringify({ message }), 409);
            };
        } catch(error) {
            // Emit an error event.
            console.error(error);
            
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
            const {
                countryCallingCode,
                nationalNumber,
                number
            } = parsePhoneNumber(req.local.body.phoneNumber);

            req.local.body.phoneNumber = {
                countryCallingCode,
                nationalNumber,
                number
            };

            const hashedPassword = bcrypt.hashSync(req.local.body.password);

            req.local.body.password = hashedPassword;

            const randomString = generateRandomString();

            req.local.body.verification = {
                code: {
                    value: randomString
                }
            };

            const user = await User.create(req.local.body);

            Service.emit("userRegister", user);

            return rep
                      .status(200)
                      .send(user);
        } catch(error) {
            // Emit an error event.
            console.error(error);

            if(error.name === "MongoServerError") return rep
                                                            .status(503)
                                                            .send(error);
                                        
            return rep
                      .status(500)
                      .send(error);
        };
    });

    done();
};

module.exports = route;