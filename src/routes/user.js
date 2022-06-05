const User = require("../models/User.js");

const { 
    register,
    login
} = require('../schemas/auth.js');

const bcrypt = require("bcrypt")
    , crypto = require("crypto");

function route(fastify, options, done) {
    // TODO: Email verification.
    // TODO: Captcha.
    // TODO: Rate-limiting.
    fastify.post("/api/v1/test/auth/register", async (req, rep) => {
        try {
            await register.validateAsync(req.body);

            const {
                firstName,
                lastName,
                emailAddress,
                username,
                password 
            } = req.body;

            const hashedPassword = await bcrypt.hash(password, 16);

            const doesUserExist = await User.findOne({ $or:[{ emailAddress }, { username }]});

            if(doesUserExist) return rep.status(409).send('A user with that emailAddress/username is already registered!');

            const token = crypto.randomBytes(128).toString('hex')
                , permissionLevel = 1
                , verificationCode = crypto.randomBytes(16).toString('hex');

            const hashedVerificationCode = await bcrypt.hash(verificationCode, 16);

            user = new User(
                {
                    firstName,
                    lastName,
                    emailAddress,
                    username,
                    password: hashedPassword,
                    token,
                    permissionLevel,
                    verificationCode: hashedVerificationCode
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

            rep.send(verificationCode);
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

            if(!user.isVerified) return rep.send(401);
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

    fastify.post("/api/v1/test/auth/verify", async (req, rep) => {
        const {
            token 
        } = req.headers;

        const {
            verificationCode
        } = req.body;

        // TODO: Input validation.
        try {
            const user = await User.find({ token });

            const doesUserExist = user ? true : false;

            if(!doesUserExist) return rep.send(404);
    
            const doesVerificationCodeMatch = await bcrypt.compare(verificationCode, user[0].verificationCode) ? true : false;
    
            if(!doesVerificationCodeMatch) return rep.send(401); 

            const updatedDoc = await User.findOneAndUpdate({
                token
            }, {
                'isVerified': true
            }, {
                new: true
            }).exec();
    
            rep.status(200).send(updatedDoc);
        } catch(err) {
            console.error(err);
        };
    });
    
    // TODO: Delete/Ban user route.
    
    done();
};

module.exports = route;