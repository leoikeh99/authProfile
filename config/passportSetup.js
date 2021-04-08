const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const GitHubStrategy = require("passport-github2");
const config = require("config");
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => done(null, user));
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/api/auth/google/redirect",
      clientID: config.get("clientId_g"),
      clientSecret: config.get("clientSecret_g"),
    },
    (accessToken, refreshToken, profile, email, done) => {
      User.findOne({ "google.id": email.id }).then((user) => {
        if (user) {
          done(null, user);
        } else {
          new User({
            username: email.displayName,
            google: {
              id: email.id,
              email: email.emails[0].value ? email.emails[0].value : "",
            },
            avatar: email.photos[0].value ? email.photos[0].value : "",
            type: "google",
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: config.get("clientId_hub"),
      clientSecret: config.get("clientSecret_hub"),
      callbackURL: "/api/auth/github/redirect",
    },
    function (accessToken, refreshToken, user, done) {
      const { id, avatar_url, name, email, bio } = user._json;
      User.findOne({ "github.id": id }).then((user) => {
        if (user) {
          done(null, user);
        } else {
          new User({
            username: name,
            bio: bio ? bio : "",
            avatar: avatar_url ? avatar_url : "",
            type: "github",
            github: {
              id: id,
              email,
            },
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
