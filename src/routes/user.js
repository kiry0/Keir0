const User = require("../models/User.js");

const { 
    register,
    login
} = require('../schemas/auth.js');

const bcrypt = require("bcrypt")
    , crypto = require("crypto");

function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/register", async (req, rep) => {
        try {
            await register.validateAsync(req.body);

            const {
                firstName,
                lastName,
                emailAddress,
                username,
                password 
            } = req.body,
            hashedPassword = await bcrypt.hash(password, 16),
            doesUserExist = await User.findOne({ $or:[{ emailAddress }, { username }]});

            if(doesUserExist) return rep.status(409).send('A user with that emailAddress/username is already registered!');

            const token = crypto.randomBytes(128).toString('hex')
                , permissionLevel = 1;

            user = new User(
                {
                    firstName,
                    lastName,
                    emailAddress,
                    username,
                    password: hashedPassword,
                    token,
                    permissionLevel
                }
            );

            user.save();

            /* TODO: Sessions. */
            // req.session.user = {
            //     firstName,
            //     lastName,
            //     emailAddress,
            //     username,
            //     password: hashedPassword,
            //     token,
            //     permissionLevel,
            //     isLoggedIn: true,
            // };

            rep.send(200);

        } catch(err) {
            if(err.isJoi === true) rep.status(422).send('Invalid Form Body!');

            console.error(err);

            rep.send(500);
        };
    }); 

    fastify.post("/api/v1/test/auth/login", async (req, rep) => {
        try {
            await login.validateAsync(req.body);

            const {
                emailAddress,
                username,
                password
            } = req.body;

            const user = (await User.find({ $or:[{ emailAddress }, { username }]}))[0];

            if(!user) return rep.send(404);

            /* TODO: Sessions. */
            // const {
            //     firstName,
            //     lastName,
            //     token,
            //     permissionLevel,
            // } = user;

            const doesPasswordMatch = await bcrypt.compare(password, user.password) ? true : false;

            if(!doesPasswordMatch) return rep.send(401); 

            /* TODO: Sessions. */
            // req.session.user = {
            //     firstName,
            //     lastName,
            //     emailAddress: emailAddress || user.emailAddress,
            //     username: username || user.username,
            //     password,
            //     token,
            //     permissionLevel,
            //     isLoggedIn: true,
            // };

            rep.send(200);
        } catch(err) {
            if(err.isJoi === true) res.status(422).send('Invalid Form Body!');
        
            console.error(err);
    
            rep.send(500);
        };
    });

    done();
};

module.exports = route;