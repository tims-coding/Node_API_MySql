const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: "root",
  user: "root",
  host: "localhost",
  database: "coursedatabase",
  port: 3306,
});

let packagedb = {};

packagedb.allPackages = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM packages", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

module.exports = packagedb;
