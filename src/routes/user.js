const User = require("../models/User.test.js");

const user = new User();

function routes(fastify, options, done) {
    fastify.post("/api/v1/test/user", (req, rep) => {
        const {
            firstName,
            lastName,
            age
        } = req.body;
    
        const user = new User({
            firstName,
            lastName,
            age
        });
    
        user.save();
    
        rep.send(201);
    }); 

    done();
};

module.exports = routes;