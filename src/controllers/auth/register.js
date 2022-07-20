const registerSchema = require("../../schemas/auth/register.js");

const doesUserAlreadyExist = require("../../lib/functions/utils/doesUserAlreadyExist.js");

const APIError = require("../../lib/classes/APIError");

const generateRandomString = require("../../lib/functions/utils/generateRandomString.js");

const User = require("../../models/User.js");

const Service = require("../../lib/classes/Service.js");

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
                phoneNumber: { number } = {},
                username
            } = req.local.body;

            req.local.doesUserAlreadyExist = await doesUserAlreadyExist({ emailAddress }, { "phoneNumber.number": number }, { username });

            if(req.local.doesUserAlreadyExist) throw new APIError(JSON.stringify(req.local.doesUserAlreadyExist), 409);
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
            req.local.body.verification = {
                code: {
                    value: generateRandomString()
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