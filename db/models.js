const db = require("./connection")
const users = require("./data/testData/users")
const { string } = require("pg-format")

const fetchUsers = () => {
    let sqlString = `SELECT * FROM users;`
    return db.query(sqlString)
    .then(({rows}) => rows)
}


const fetchUsername = (query) => {
    const values = [query]
    if (typeof values[0] !== 'string') {return Promise.reject({status: 400, msg: 'Bad Request'})}
    const sqlString = `SELECT * from users
    WHERE users.username = $1;`

    return db.query(sqlString, values)
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Not Found" })
        } else {
            return rows
        }
    })
}

module.exports = {fetchUsername, fetchUsers};