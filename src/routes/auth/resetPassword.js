            // check if the token already exists.
            // check if it has not expired.
            // if () delete token and send a new one.
            // else send passwordReset code.

            // user.authorization.tokens.passwordReset.filter(t => t.value === "bUXK8YEZ")
            const passwordResetTokenExpiry = user.authorization.tokens.passwordReset.filter(t => t.value === "bUXK8YEZ")[0].expiresAt;

            if(Math.floor(Math.abs(new Date() - passwordResetTokenExpiry) / 3.6e6) <= 0) {

            };