const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const {
  getUsers,
  getUsername,
  sendUser,
  getUserGeoData,
  getAllGeoData,
  getGeoDataById,
  postGeoDrop,
  removeAllPins,
  removeOnePin,
  getUserbyID,
} = require("./controllers");

app.get("/api/users", getUsers);

app.get("/api/users/:username", getUsername);

app.get("/api/users/id/:user_id", getUserbyID);

app.post("/api/users", sendUser);

app.get("/api/users/:user_id/geodata", getUserGeoData);

app.get("/api/geodata", getAllGeoData);

app.get("/api/geodata/:geodata_id", getGeoDataById);

app.post("/api/geodata", postGeoDrop);

app.delete("/api/users/:user_id/geodata", removeAllPins);

app.delete("/api/geodata/:geodata_id", removeOnePin);

//error handling

app.use((err, req, res, next) => {
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
