function route(fastify, options, done) {
    fastify.post("/api/v1/test/auth/logout", (req, rep) => {
        try {
            const {
                token
            } = req.cookies;
            
            if(!token) return rep
                                 .status(200);

            rep
               .clearCookie("refreshToken", {
                   path: "/"             
               })
               .clearCookie("token", {
                   path: "/"
               })
               .status(200)
               .send("Successfully logged out!");

        } catch(err) {
            if(err) console.error(err);

            rep.status(500);
        };
    });

    done();
};

module.exports = route;