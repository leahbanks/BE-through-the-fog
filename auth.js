const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
require("dotenv").config();
const db = require("./db/connection");
const { fetchUserID, createUser, fetchUsername } = require("./db/models");

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

/*       try {
        const currentUserQuery = await db.query(
          "SELECT * FROM users WHERE username=$1",
          [account.sub]
        );
        if (currentUserQuery.rows.length === 0) {
          //create user
          await db.query(
            "INSERT INTO users (username, display_name, avatar_url) VALUES ($1, $2, $3)",
            [account.sub, account.name, account.picture]
          );
          const username = await db.query(
            "SELECT username FROM users WHERE username=$1",
            [account.sub]
          );
          user = {
            username,
            display_name: account.name,
            avatar_url: account.picture
          }
        } else {
          console.log(currentUserQuery.rows[0].username)
            user = {
                username: currentUserQuery.rows[0].username,
                display_name: currentUserQuery.rows[0].display_name,
                avatar_url: currentUserQuery.rows[0].avatar_url
            }
        }
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
); */

passport.serializeUser((user, done) => {
  // loads into req.session.passport.user
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // loads into req.user
  done(null, user);
});
