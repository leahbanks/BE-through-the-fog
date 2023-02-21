const db = require("../connection");
const format = require("pg-format");

const seed = ({ geodata, userData }) => {
  return db
    .query(`DROP TABLE IF EXISTS users;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS GEOdata;`);
    })
    .then(() => {
      const usersTablePromise = db.query(`
			CREATE TABLE users (
				user_id SERIAL PRIMARY KEY,
				password VARCHAR,
        username VARCHAR,
        avatar_url VARCHAR

			);`);
      const geodataTablePromise = db.query(`
			CREATE TABLE geodata (
        location_id SERIAL PRIMARY KEY,
				locations VARCHAR,
        user_id INT REFERENCES users(user_id) NOT NULL
			);`);

      return Promise.all([geodataTablePromise, geodataTablePromise]);
    })
    .then(() => {
      const insertGeoDataQueryStr = format(
        "INSERT INTO geodata (locations) VALUES %L;",
        geodata.map(({ locations }) => [locations])
      );
      const geoPromise = db.query(insertGeoDataQueryStr);

      const insertUsersQueryStr = format(
        "INSERT INTO users (user_id, password, username, avatar_url) VALUES %L;",
        userData.map(({ username, password, avatar_url }) => [
          username,
          password,
          avatar_url,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);

      return Promise.all([geoPromise, usersPromise]);
    });
};

module.exports = seed;
