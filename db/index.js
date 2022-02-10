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

let usersdb = {};

usersdb.all = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

usersdb.one = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results[0]);
    });
  });
};

usersdb.add = (name, guests, package, id) => {
  return new Promise((resolve, reject) => {
    const createdAt = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    const updatedAt = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    pool.query(
      "INSERT INTO users (name, guests, package, id, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
      [name, guests, package, id, createdAt, updatedAt],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

usersdb.delete = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

usersdb.update = (name, guests, package, id) => {
  return new Promise((resolve, reject) => {
    const updatedAt = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    pool.query(
      "UPDATE users SET name = ?, package = ?, guests = ?, updatedAt = ? WHERE id = ?",
      [name, package, guests, updatedAt, id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = usersdb;
