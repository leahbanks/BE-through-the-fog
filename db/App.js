const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const { getUsers, getUsername, sendUser } = require("./controllers");

app.get("/api/users", getUsers);

app.get("/api/users/:username", getUsername);

app.post("/api/users", sendUser);

//error handling

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
