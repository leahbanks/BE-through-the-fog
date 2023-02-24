const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 3000;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(express.json());

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
});

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
  getTrips,
  postToTrips,
  multiPostToTrips,
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

app.get("/api/trips/:user_id", getTrips);

app.post("/api/trips/:user_id", multiPostToTrips);

//error handling

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
