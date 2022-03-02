const mysql = require("mysql");
require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: 3306,
});

let transactiondb = {};

transactiondb.one = (id) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM transactions WHERE id = ? ORDER BY datetime DESC",
      [id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

transactiondb.all = (gameToken) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM transactions WHERE gameToken = ? ORDER BY datetime DESC",
      [gameToken],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

transactiondb.add = (id, name, amount, transaction, note, gameToken) => {
  return new Promise((resolve, reject) => {
    const datetime = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    pool.query(
      "INSERT INTO transactions (id, name, datetime, amount, transaction, note, gameToken) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, name, datetime, amount, transaction, note, gameToken],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = transactiondb;
