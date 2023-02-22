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

  if (data.password) {
    (sqlString += `, password`), values.push(data.password);
  }
  if (data.avatar_url) {
    (sqlString += `, avatar_url`), values.push(data.avatar_url);
  }

  sqlString += `)
    VALUES ($1`;

  if (data.password) {
    sqlString += `, $2`;
  }
  if (data.avatar_url) {
    sqlString += `, $3`;
  }

  sqlString += `)
    RETURNING *;`;

  return db.query(sqlString, values).then(({ rows }) => rows);
};

const fetchGeoData = (user) => {
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
    let sqlString = `SELECT * FROM geodata;`;
  return db.query(sqlString).then(({ rows }) => rows);
};


module.exports = { fetchUsername, fetchUsers, createUser, fetchGeoData, fetchAllGeoData };
