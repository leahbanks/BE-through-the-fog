const db = require("../connection");
const format = require("pg-format");

const seed = ({ geoData, userData }) => {
  console.log(geoData);
  return db
    .query(`DROP TABLE IF EXISTS geodata;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
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
        img_url VARCHAR,
        user_id INT REFERENCES users(user_id)
			);`);

      return Promise.all([usersTablePromise, geodataTablePromise]);
    })
    .then(() => {
      const insertGeoDataQueryStr = format(
        "INSERT INTO geodata (locations, img_url, user_id) VALUES %L;",
        geoData.map(({ locations, img_url, user_id }) => [
          locations,
          img_url,
          user_id,
        ])
      );
      const geoPromise = db.query(insertGeoDataQueryStr);

      const insertUsersQueryStr = format(
        "INSERT INTO users (username, password, avatar_url) VALUES %L;",
        userData.map(({ username, password, avatar_url }) => [
          username,
          password,
          avatar_url,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);
      console.log("done");
      return Promise.all([geoPromise, usersPromise]);
    });
};

module.exports = seed;
