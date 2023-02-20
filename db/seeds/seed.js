const db = require('../connection');
const format = require('pg-format');


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
                username VARCHAR

			);`);
      const geodataTablePromise = db.query(`
			CREATE TABLE geodata (
                location_id SERIAL PRIMARY KEY
				locations text[][], 
			);`);

      return Promise.all([godataTablePromise, geodataTablePromise]);
    })
     .then(() => {
      const insertGeoDataQueryStr = format(
        'INSERT INTO categories (slug, description) VALUES %L;',
        geodata.map(({ slug }) => [slug])
      );
      const categoriesPromise = db.query(insertCategoriesQueryStr);

      const insertUsersQueryStr = format(
        'INSERT INTO users (user_id, password, username) VALUES %L;',
        userData.map(({ username, password }) => [
          username,
          password
        ])
      );
      const usersPromise = db.query(insertUsersQueryStr);

      return Promise.all([categoriesPromise, usersPromise]);
    })
}

module.exports = seed;