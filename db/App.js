const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
require("../auth");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
  getTrips,
  postToTrips,
  multiPostToTrips,
  removeTrip,
} = require("./controllers");

// app.get("/", (req, res) => {
//   res.redirect("/api-docs");
// });

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

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

const indexRouter = require("../routes/indexRouter");
app.use("/", indexRouter);

const authRouter = require("../routes/authRouter");
app.use("/auth", authRouter);

app.use(passport.initialize());
app.use(passport.session());

/* app.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
}); */

app.get("/api/users", getUsers);

app.get("/api/users/:username", getUsername);

app.get(
  "/api/users/id/:user_id",
  passport.authenticate("session"),
  getUserbyID
);

app.post("/api/users", sendUser);

app.get("/api/users/:user_id/geodata", getUserGeoData);

app.get("/api/geodata", getAllGeoData);

app.get("/api/geodata/:geodata_id", getGeoDataById);

app.post("/api/geodata", postGeoDrop);

app.delete("/api/users/:user_id/geodata", removeAllPins);

app.delete("/api/geodata/:geodata_id", removeOnePin);

app.get("/api/trips/:user_id", getTrips);

app.post("/api/trips/:user_id", multiPostToTrips);

app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ message: "You are authenticated" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});

//error handling

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.status).send({ msg: err.msg });
});

module.exports = app;
