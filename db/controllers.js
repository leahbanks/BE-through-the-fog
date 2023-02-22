const {
  fetchUsers,
  fetchUsername,
  createUser,
  fetchGeoDataByUser,
  fetchAllGeoData,
} = require("./models");

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
  fetchAllGeoData().then((data) => {
    res.status(200).send(data);
  });
};

module.exports = {
  getUsers,
  getUsername,
  sendUser,
  getUserGeoData,
  getAllGeoData,
};
