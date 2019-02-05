require("dotenv").config();
var authKeys = require("./auth_info");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: authKeys.clientId,
        clientSecret: authKeys.clientSecret,
        callbackURL: authKeys.callbackUrl
      },
      (token, refreshToken, profile, done) => {
        return done(null, {
          profile: profile,
          token: token
        });
      }
    )
  );
};
