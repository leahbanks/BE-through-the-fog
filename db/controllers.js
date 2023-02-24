const {
  fetchUsers,
  fetchUsername,
  createUser,
  fetchGeoDataByUser,
  fetchAllGeoData,
  fetchGeoDataById,
  sendGeoDrop,
  deleteAllPins,
  deleteOnePin,
  fetchTrips,
  addToTrips,
} = require("./models");

const { Format_coords } = require("./utils");

const getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send(users);
  });
};

const getUsername = (req, res, next) => {
  const query = req.params.username;
  fetchUsername(query)
    .then((username) => {
      res.status(200).send(username);
    })
    .catch((err) => next(err));
};

const getUserbyID = (req, res, next) => {
  const query = req.params.user_id;
  fetchUserID(parseInt(query))
    .then((id) => {
      res.status(200).send(id);
    })
    .catch((err) => err);
};

const sendUser = (req, res, next) => {
  const data = req.body;
  createUser(data)
    .then((users) => {
      res.status(201).send(users);
    })
    .catch((err) => next(err));
};

const getUserGeoData = (req, res, next) => {
  const user = req.params.user_id;
  fetchGeoDataByUser(user)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => next(err));
};

const getAllGeoData = (req, res, next) => {
  fetchAllGeoData()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => next(err));
};

const getGeoDataById = (req, res, next) => {
  const id = req.params.geodata_id;
  fetchGeoDataById(id)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => next(err));
};

const postGeoDrop = (req, res, next) => {
  const comment = req.body.comment;
  const url = req.body.img_url;
  const user = req.body.user_id;
  const location = Format_coords(req.body.location);
  sendGeoDrop(location, url, comment, user)
    .then((drop) => {
      res.status(201).send(drop);
    })
    .catch((err) => next(err));
};

const removeAllPins = (req, res, next) => {
  const query = req.params;
  deleteAllPins(query)
    .then((response) => {
      res.status(204).send(response);
    })
    .catch((err) => next(err));
};

const removeOnePin = (req, res, next) => {
  const query = req.params;
  deleteOnePin(query)
    .then((response) => {
      res.status(204).send(response);
    })
    .catch((err) => next(err));
};

const getTrips = (req, res, next) => {
  const user_id = req.params.user_id;
  const trip_id = req.query.trip_id;
  fetchTrips(user_id, trip_id)
    .then((trips) => {
      res.status(200).send(trips);
    })
    .catch((err) => next(err));
};

const postToTrips = (req, res, next) => {
  const user_id = req.params.user_id;
  const trip_id = req.body.trip_id;
  const location = Format_coords(req.body.location);
  const circle_size = req.body.circle_size;
  addToTrips(location, user_id, trip_id, circle_size)
    .then((trips) => {
      res.status(201).send(trips);
    })
    .catch((err) => next(err));
};

module.exports = {
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
};
