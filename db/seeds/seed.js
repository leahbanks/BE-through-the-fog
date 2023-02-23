const db = require("../connection");
const format = require("pg-format");

const seed = ({ geoData, userData, tripData }) => {
  return db
    .query(`DROP TABLE IF EXISTS geodata;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS trips;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      const usersTablePromise = db.query(`
			CREATE TABLE users (
				user_id SERIAL PRIMARY KEY,
				display_name VARCHAR,
        username VARCHAR,
        avatar_url VARCHAR
			);`);
      return usersTablePromise;
    })
    .then(() => {
      const geodataTablePromise = db.query(`
        CREATE TABLE geodata (
          geodata_id SERIAL PRIMARY KEY,
          location DEC[][],
          img_url VARCHAR,
          comment VARCHAR(140),
          user_id INT REFERENCES users(user_id)
        );`);

      return geodataTablePromise;
    })
    .then(() => {
      const tripsTablePromise = db.query(`
      CREATE TABLE trips (
        entry_id SERIAL PRIMARY KEY,
        trip_id INT NOT NULL,
        user_id INT REFERENCES users(user_id),
        location DEC[][],
        circle_size DEC
      );`);

      return tripsTablePromise;
    })
    .then(() => {
      const insertUsersQueryStr = format(
        "INSERT INTO users (username, display_name, avatar_url) VALUES %L;",
        userData.map(({ username, display_name, avatar_url }) => [
          username,
          display_name,
          avatar_url,
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);
      return usersPromise;
    })
    .then(() => {
      const insertGeoDataQueryStr = format(
        "INSERT INTO geodata (location, img_url, comment, user_id) VALUES %L;",
        geoData.map(({ location, img_url, comment, user_id }) => [
          location,
          img_url,
          comment,
          user_id,
        ])
      );
      const geoPromise = db.query(insertGeoDataQueryStr);
      return geoPromise;
    })
    .then(() => {
      const insertTripDataQueryStr = format(
        "INSERT INTO trips (location, trip_id, user_id, circle_size) VALUES %L;",
        tripData.map(({ location, trip_id, user_id, circle_size }) => [
          location,
          trip_id,
          user_id,
          circle_size,
        ])
      );
      const tripPromise = db.query(insertTripDataQueryStr);
      return tripPromise;
    });
};

module.exports = seed;
