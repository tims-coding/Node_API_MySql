const mysql = require("mysql");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: 3306,
});

let adminsdb = {};

adminsdb.register = (username, password) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    pool.query(
      "INSERT INTO admins (username, password, id) VALUES (?, ?, ?)",
      [username, password, id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

adminsdb.login = (username, password) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM admins WHERE username = ? AND password = ?",
      [username, password],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        if (result.length > 0) {
          return resolve(result[0]);
        } else {
          reject(result);
        }
      }
    );
  });
};

module.exports = adminsdb;
