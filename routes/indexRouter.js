const express = require("express");
const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
    res.send(req.session.passport.user);
})

module.exports = indexRouter;