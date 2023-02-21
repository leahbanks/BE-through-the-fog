const {fetchUsers, fetchUsername} = require('./models')

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

module.exports = { getUsers, getUsername };
