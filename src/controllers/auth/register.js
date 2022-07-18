const registerSchema = require("../../schemas/register.js");

const User = require("../../models/User.js");

const generateRandomString = require("../../lib/functions/utils/generateRandomString.js");

const keir0 = require("../../lib/classes/Keir0.js");

function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/register", async (req, rep) => {
        try {
            const {
                firstName,
                middleName,
                lastName,
                emailAddress,
                phoneNumber,
                username,
                password
            } = await registerSchema.validateAsync(req.body);

            const user = await User.create(
                {
                    firstName,
                    middleName,
                    lastName,
                    emailAddress,
                    phoneNumber,
                    username,
                    password,
                    verification: {
                        code: {
                            value: generateRandomString()
                        }
                    }
                }
            );

            keir0.emit("userRegister", user);

            rep
               .status(201)
               .send(user);
        } catch(err) {
            // Emit an error event.
            console.error(err);
            /* */
            if(err.isJoi === true) return rep
                                             .status(422)
                                             .send(err.details[0]);

            if(err.name === "MongoServerError" && err.code === 11000) return rep
                                                                                .status(409)
                                                                                .send("A user with that emailAddress/username/phoneNumber already exists!");

            rep
               .status(500)
               .send(err);
        };
    });

    done();
};

module.exports = route;