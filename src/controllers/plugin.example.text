function route(fastify, options, done) {
    fastify.addHook("preHandler", (req, rep, next) => {
        // const token = req.body.token || req.query.token || req.headers["x-access-token"];    

        // // add validation for token;
        // if(!token) return rep.sendStatus(400);

        // try {
        //     const decoded = jwt.verify(token, process.env.TOKEN_KEY);

        //     res.user = decoded;
        // } catch(err) {
        //     if(err) rep
        //                .status(401)
        //                .send("Invalid Token");
        // };
        console.log(req.body);
        next();
    });

    fastify.post("/test", (req, rep) => {
        rep.send("Hello World!");
    });

    done();
};

module.exports = route;