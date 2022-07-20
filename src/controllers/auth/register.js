const registerSchema = require("../../schemas/register.js");

const User = require("../../models/User.js");

const generateRandomString = require("../../lib/functions/utils/generateRandomString.js");

const Service = require("../../lib/classes/Service.js");

function route(fastify, options, done) {
    fastify.post("/api/v1/auth/register", async (req, rep) => {
        try {
            req.local = { user: await registerSchema.validateAsync(req.body) };
        } catch (error) {
            if(error) {
                // Emit an error event.
                console.error(error);

                if(error.isJoi === true) return rep
                                                   .status(422)
                                                   .send(error.details);

                return rep
                          .status(500)
                          .send(error);
            };
        };
        
        try {
            const {
                emailAddress,
                phoneNumber: { number } = {},
                username
            } = req.local.user;

            const user = await User.findOne({
                $or: [
                    { emailAddress },
                    { "phoneNumber.number": number },
                    { username }
                ]
            });

            const arr = [];

            if(user?.emailAddress === emailAddress) arr.push({ message: "{ emailAddress } is already taken!" });

            if(user?.phoneNumber.number === number) arr.push({ message: "{ phoneNumber } is already taken!" });

            if(user?.username === username) arr.push({ message: "{ username } is already taken!" });

            if(arr.length >= 1) return rep
                                           .status(409)
                                           .send(arr);
        } catch(error) {
            // Emit an error event.
            console.error(error);

            if(error.isJoi === true) return rep
                                               .status(422)
                                               .send(error.message);

            return rep
                      .status(500)
                      .send(error);
        };
        
        try {
            req.local.user.verification = {
                code: {
                    value: generateRandomString()
                }
            };

            await User.create(req.local.user);

            Service.emit("userRegister", req.local.user);

            return rep
                      .status(200)
                      .send(req.local.user);
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