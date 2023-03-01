const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
require("dotenv").config();
const db = require("../connection");
const { createUser, fetchUsername } = require("../models");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const account = profile._json;
      const {
        sub: username,
        name: display_name,
        picture: avatar_url,
      } = account;

      const user = {
        username,
        display_name,
        avatar_url,
      };

      fetchUsername(user.username)
        .then((currentUser) => {
          console.log(currentUser, "hello");
          currentUser;
          // checking if response contains a user obj from our db
          if (currentUser.length) {
            done(null, currentUser[0]);
          } else {
            // if not, create a new user in the database
            createUser(user);
            console.log(user);
            fetchUsername(user.username)
              .then((newUser) => {
                newUser;
                done(null, newUser[0]);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => {
          console.log(err);
          done(err, null);
        });
    }
  )
);

passport.use(
  new LocalStrategy(async function (username, pass, done) {
    try {
      // Searches database for the username username
      const user = await db.query("SELECT * FROM users WHERE username=$1", [
        username,
      ]);

      // If the username is not in the database, return a message(better practice not to indicate whether the email or password is incorrect for security reasons)
      if (!user.rows.length) {
        return done(null, false, { message: "Incorrect email or password." });
      }

      // If the username is in the database, compare the password sent in with the hashed password in the database using bcrypt
      const match = await bcrypt.compare(pass, user.rows[0].password);
      if (!match) {
        return done(null, false, { message: "Incorrect email or password." });
      }

      // If the password matches, return the user object, minus the password!! (very important)
      const { password, ...userObject } = user.rows[0];
      return done(null, userObject);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  // loads into req.session.passport.user
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // loads into req.user
  done(null, user);
});
