const {
  fetchUsers,
  fetchUsername,
  fetchUserID,
  createUser,
  fetchGeoDataByUser,
  fetchAllGeoData,
  fetchGeoDataById,
  sendGeoDrop,
  deleteAllPins,
  deleteOnePin,
  fetchTrips,
  addToTrips,
  multiAddToTrips,
  killAll,
} = require("./models");

const { Format_coords, formatGetTrips, formatPostTrips } = require("./utils");

const getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send(users);
  });
};

const getUsername = (req, res, next) => {
  const query = req.params.username;
  fetchUsername(query)
    .then((username) => {
      console.log(username);
      res.status(200).send(username);
    })
    .catch((err) => next(err));
};

const getUserbyID = (req, res, next) => {
  if (req.isAuthenticated()) {
    const query = req.user.user_id;
    console.log(query);
    fetchUserID(parseInt(query))
      .then((id) => {
        res.status(200).send(id);
      })
      .catch((err) => next(err));
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
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
  if (req.isAuthenticated()) {
    const user = req.user.user_id;
    fetchGeoDataByUser(user)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => next(err));
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
};

const getAllGeoData = (req, res, next) => {
  if (req.isAuthenticated()) {
    fetchAllGeoData()
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => next(err));
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
};

const getGeoDataById = (req, res, next) => {
  if (req.isAuthenticated()) {
    const id = req.params.geodata_id;
    fetchGeoDataById(id)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => next(err));
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
};

const postGeoDrop = (req, res, next) => {
  if (req.isAuthenticated()) {
    const comment = req.body.comment;
    const url = req.body.img_url;
    const user = req.body.user_id;
    const location = Format_coords(req.body.location);
    sendGeoDrop(location, url, comment, user)
      .then((drop) => {
        res.status(201).send(drop);
      })
      .catch((err) => next(err));
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
};

const removeAllPins = (req, res, next) => {
  if (req.isAuthenticated()) {
    const query = req.params;
    deleteAllPins(query)
      .then((response) => {
        res.status(204).send(response);
      })
      .catch((err) => next(err));
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
};

const removeOnePin = (req, res, next) => {
  if (req.isAuthenticated()) {
    const query = req.params;
    const user_id = req.user.user_id;
    deleteOnePin(query, user_id)
      .then((response) => {
        res.status(204).send(response);
      })
      .catch((err) => next(err));
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
};

const getTrips = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user_id = req.user.user_id;
    const trip_id = req.query.trip_id;
    fetchTrips(user_id, trip_id)
      .then((trips) => {
        res.status(200).send(formatGetTrips(trips));
      })
      .catch((err) => next(err));
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
};

// Maybe dont need this?
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

const multiPostToTrips = (req, res, next) => {
  if (req.isAuthenticated()) {
    const formattedBody = formatPostTrips(req.body);
    multiAddToTrips(formattedBody)
      .then((response) => {
        res.status(201).send(formatGetTrips(response));
      })
      .catch((err) => next(err));
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
};

const removeAllTrips = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user_id = req.user.user_id;
    killAll(user_id)
      .then((response) => {
        res.status(204).send(response);
      })
      .catch((err) => next(err));
  } else {
    res.status(401).json({ msg: "Not authenticated" });
  }
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
  multiPostToTrips,
  removeAllTrips,
};
