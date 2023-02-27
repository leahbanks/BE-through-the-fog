// const express = require('express');
// const cookieSession = require('cookie-session');
// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oidc');

// const { fetchUserID, createUser } = require('./db/models');

// const app = express();

// app.use(passport.initialize());
// //session cookies
// app.use(passport.session());

// app.use(cookieSession({
//   // age of the cookie in milliseconds
//      // cookie will expire after one day
//   maxAge: 24 * 60 * 60 * 1000,
//   // encrypts the user id
//   keys: [process.env.COOKIEKEY],
// }));
// // setting up serialize and deserialize methods from passport
// passport.serializeUser((user, done) => {
//   // calling done method once user is returned from db
//   done(null, user.googleid);
// });

// passport.deserializeUser((id, done) => {
//   fetchUserID(id)
//     .then(currentUser => {
//       // calling done once we've found the user
//       done(null, currentUser[0]);
//     })});

// // login route
// app.get('/login', passport.authenticate('google', {
//   scope: ['profile', 'email'],
// }));

// //redirect route
// app.get('/googleRedirect', passport.authenticate('google'), (req, res) => {
//   res.redirect('/profile');
// });

// setting up Google Strategy when we get the profile info back from Google
// passport.use(new GoogleStrategy({
//   callbackURL: '/googleRedirect',
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// }, (accessToken, refreshToken, profile, done) => {
//   // passport cb function
//   const {
//     email: username,
//     name: display_name,  
//     picture: avatar_url, 
//   } = profile;

//   const user = {
//     username,
//     display_name,
//     avatar_url
//   };

//   fetchUserID(user)
//     .then(currentUser => {
//       currentUser;

//       // checking if response contains a user obj from our db
//       if (currentUser.length) {
//         done(null, currentUser[0]);
//       } else {
//       // if not, create a new user in the database
//         createUser(user);
//         getUser(googleId)
//           .then(newUser => {
//             newUser;
//             done(null, newUser[0]);
//           })
//           .catch(err => console.log(err));
//       }
//     });
// }));

// const port = 8000;

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });