const db = require("./connection");
const users = require("./data/testData/users");
const { string } = require("pg-format");

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
  let sqlString = `SELECT geodata.geodata_id, geodata.user_id FROM geodata;`;
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
  const check = parseInt(query.user_id)
  if (isNaN(check)) {return Promise.reject({status: 400, msg: "Bad Request"})}

  
  const values = [query.user_id]

  let sqlString = `DELETE * FROM geodata
  WHERE geodata.user_id = $1;`

  return db.query(sqlString, values)
  .then(({rows}) => rows)}

  const deleteOnePin = (query) => {
    const check = parseInt(query.geodata_id)
    if (isNaN(check)) {return Promise.reject({status: 400, msg: "Bad Request"})}
  
    
    const values = [query.geodata_id]
  
    let sqlString = `DELETE * FROM geodata
    WHERE geodata.geodata_id = $1;`
  
    return db.query(sqlString, values)
    .then(({rows}) => rows)}

module.exports = {
  fetchUsername,
  fetchUsers,
  createUser,
  fetchGeoDataByUser,
  fetchAllGeoData,
  fetchGeoDataById,
  sendGeoDrop,
  deleteAllPins,
  deleteOnePin
};
