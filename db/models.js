const db = require("./connection");
const users = require("./data/testData/users");
const format = require("pg-format");

const fetchUsers = () => {
  let sqlString = `SELECT * FROM users;`;
  return db.query(sqlString).then(({ rows }) => rows);
};

const fetchUsername = (query) => {
  const values = [query];
  if (typeof values[0] !== "string") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const sqlString = `SELECT * from users
    WHERE users.username = $1;`;

  return db.query(sqlString, values).then(({ rows }) => rows);
};

const fetchUserID = (query) => {
  const values = [query];
  if (typeof values[0] !== "number") {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const sqlString = `SELECT * from users
    WHERE users.user_id = $1;`;

  return db.query(sqlString, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Not Found" });
    } else {
      return rows;
    }
  });
};

const createUser = (data) => {
  const values = [data.username];
  if (data.username === undefined) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  let sqlString = `INSERT INTO users (username`;

  if (data.display_name) {
    (sqlString += `, display_name`), values.push(data.display_name);
  }
  if (data.avatar_url) {
    (sqlString += `, avatar_url`), values.push(data.avatar_url);
  }

  sqlString += `)
    VALUES ($1`;

  if (data.display_name) {
    sqlString += `, $2`;
  }
  if (data.avatar_url) {
    sqlString += `, $3`;
  }

  sqlString += `)
    RETURNING *;`;

  return db.query(sqlString, values).then(({ rows }) => rows);
};

const fetchGeoDataByUser = (user) => {
  const values = [user];

  const checkUserSql = `SELECT * FROM users
    WHERE users.user_id = $1;`;

  const sqlString = `SELECT * FROM geodata
    WHERE geodata.user_id = $1;`;

  return db.query(checkUserSql, values).then((result) => {
    if (result.rowCount === 0) {
      return Promise.reject({ status: 404, msg: "User not found" });
    } else {
      return db.query(sqlString, values).then(({ rows }) => rows);
    }
  });
};

const fetchAllGeoData = () => {
  let sqlString = `SELECT geodata.geodata_id, geodata.location, geodata.user_id FROM geodata;`;
  return db.query(sqlString).then(({ rows }) => rows);
};

const fetchGeoDataById = (id) => {
  const values = [id];

  const sqlString = `SELECT * from geodata
WHERE geodata.geodata_id = $1;`;

  return db.query(sqlString, values).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Geodata not found with matching ID",
      });
    } else {
      return rows;
    }
  });
};

const sendGeoDrop = (location, url, comment, user) => {
  const values = [location, url, comment, user];

  const sqlString = `INSERT INTO geodata (location, img_url, comment, user_id)
  VALUES
  ($1, $2, $3, $4)
  RETURNING *;`;

  return db
    .query(sqlString, values)
    .then(({ rows }) => rows)
    .catch((err) => {
      console.log(err);
    });
};

const deleteAllPins = (query) => {
  const check = parseInt(query.user_id);
  if (isNaN(check)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const values = [query.user_id];

  let sqlString = `DELETE FROM geodata
  WHERE geodata.user_id = $1;`;

  return fetchUserID(check).then(() => {
    return db.query(sqlString, values).then(({ rows }) => rows);
  });
};

const deleteOnePin = (query, user_id) => {
  const check = parseInt(query.geodata_id);
  if (isNaN(check)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const geo_id = [query.geodata_id];

  return db
    .query(
      `SELECT FROM geodata
  WHERE geodata.geodata_id = $1;`,
      geo_id
    )
    .then((geoData) => {
      if (geoData.user_id === user_id) {
        let sqlString = `DELETE FROM geodata
        WHERE geodata.geodata_id = $1;`;

        return db.query(sqlString, geo_id).then(({ rows }) => rows);
      }
    });
};

const fetchTrips = (user_id, trip_id) => {
  const check = parseInt(user_id);
  if (isNaN(check)) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  let values = [user_id];

  let sqlString = `SELECT * FROM trips
    WHERE trips.user_id = $1`;

  if (trip_id && !isNaN(trip_id)) {
    (sqlString += ` AND trips.trip_id = $2`), values.push(trip_id);
  }

  sqlString += `;`;

  return fetchUserID(check).then(() => {
    return db.query(sqlString, values).then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      } else {
        return rows;
      }
    });
  });
};

const addToTrips = (location, user_id, trip_id, circle_size) => {
  const values = [location, user_id, trip_id, circle_size];

  for (let i = 0; i < values.length; i++) {
    if (values[i] === undefined || values[i] === null) {
      return Promise.reject({ status: 400, msg: "Bad Request" });
    }
  }

  let sqlString = `INSERT INTO trips (location, trip_id, user_id, circle_size)
   VALUES
   ($1, $2, $3, $4)
   returning *;`;

  return db
    .query(sqlString, values)
    .then(({ rows }) => rows)
    .catch((err) => {
      console.log(err);
    });
};

const multiAddToTrips = (array) => {
  const insertTripDataQueryStr = format(
    "INSERT INTO trips (location, trip_id, user_id, circle_size) VALUES %L RETURNING *;",
    array.map(({ location, trip_id, user_id, circle_size }) => [
      location,
      trip_id,
      user_id,
      circle_size,
    ])
  );
  return db.query(insertTripDataQueryStr).then(({ rows }) => rows);
};

const killAll = (user_id) => {
  const values = [user_id];

  sqlString = `DELETE * FROM trips
  WHERE trips.user_id = $1`;

  return db
    .query(sqlString, values)
    .then(({ rows }) => rows)
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  fetchUsername,
  fetchUsers,
  createUser,
  fetchGeoDataByUser,
  fetchAllGeoData,
  fetchGeoDataById,
  sendGeoDrop,
  deleteAllPins,
  deleteOnePin,
  fetchUserID,
  fetchTrips,
  addToTrips,
  multiAddToTrips,
  killAll,
};
