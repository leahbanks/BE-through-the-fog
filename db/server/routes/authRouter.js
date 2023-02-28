const express = require("express");
const router = express.Router();
const passport = require("passport");
require('../isAuth')

router.get(
  "/google",
  passport.authenticate("google", {
    scope: "profile",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: true}),
  (req, res) => {
    res.redirect(`/home`);
  }
);

module.exports = router;