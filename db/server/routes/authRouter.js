const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const passport = require("passport");
const db = require("../../connection");
const { truncateSync } = require("fs");
require("../isAuth");

router.get(
  "/google",
  passport.authenticate("google", {
    scope: "profile",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: true }),
  (req, res) => {
    res.redirect(`/home`);
  }
);

router.get("/login", (req, res) => {
  const errorMessage = req.query.error;
  res.json({ error: errorMessage });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // send the error back in a json
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      // send the user to the home page with user obj
      return res.redirect(`/home`);
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/home"); // redirect the user to the home page when logged out
  });
});

router.post("/signup", async (req, res, next) => {
  try {
    const { display_name, username, password } = req.body;

    // Checks if the username is already registered
    const existingUser = await db.query(
      "SELECT * FROM users WHERE username=$1",
      [username]
    );
    if (existingUser.rows.length) {
      return res
        .status(400)
        .send({ message: "Username is already registered." });
    }

    // Salts and hash the password using bcrypt, this converts it into a bunch of random letters numbers and symbols
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Creates the new user in the database
    const newUser = await db.query(
      "INSERT INTO users (username, display_name, password) VALUES ($1, $2, $3) RETURNING user_id, username, display_name, avatar_url",
      [username, display_name, hash]
    );

    // Log in the user after they've signed up
    req.login(newUser.rows[0], (err) => {
      if (err) return next(err);
      return res.redirect("/home");
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
