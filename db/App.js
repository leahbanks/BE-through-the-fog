const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const session = require("express-session")
const passport = require("passport")
require('../auth')


app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === "production" ? "true" : "auto",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    resave: false,
    saveUninitialized: false,
  })
);

const indexRouter = require("../routes/indexRouter");
app.use("/", indexRouter);

const authRouter = require("../routes/authRouter");
app.use("/auth", authRouter);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.get("/api/trips/:user_id", getTrips)

//error handling

// app.use((err, req, res, next) => {
//   res.status(err.status).send({ msg: err.msg });
// });

app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});

module.exports = app;
