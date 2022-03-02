const mysql = require("mysql");
require("dotenv").config();
var randomColor = require("randomcolor");
const { v4: uuidv4 } = require("uuid");

const pool = mysql.createPool({
  connectionLimit: 10,
  password: process.env.DB_PASS,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: 3306,
});

let playersdb = {};

playersdb.onePlayer = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM players WHERE id = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results[0]);
    });
  });
};

playersdb.getAllPlayers = () => {
  return new Promise((resolve, reject) => {
    pool.query("SELECT * FROM players ORDER BY name ASC", (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

playersdb.allPlayers = (gameToken) => {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM players WHERE gameToken = ? ORDER BY name ASC",
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

playersdb.addPlayer = (name, gameToken) => {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    const balance = 0;
    const tips = 0;
    const description = "";
    const employeestatus = 1;
    const epaystatus = 1;
    const telegram = "";
    const color = randomColor({
      luminosity: "random",
      hue: "blue",
    });
    const createdAt = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    const updatedAt = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    pool.query(
      "INSERT INTO players (id, gameToken, balance, color, description, tips, employeestatus, epaystatus, telegram, name, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        gameToken,
        balance,
        color,
        description,
        tips,
        employeestatus,
        epaystatus,
        telegram,
        name,
        createdAt,
        updatedAt,
      ],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

playersdb.deletePlayer = (id) => {
  return new Promise((resolve, reject) => {
    pool.query("DELETE FROM players WHERE id = ?", [id], (err, results) => {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

playersdb.updatePlayer = (
  name,
  description,
  employeestatus,
  epaystatus,
  telegram,
  id
) => {
  return new Promise((resolve, reject) => {
    const updatedAt = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    pool.query(
      "UPDATE players SET name = ?, description = ?, employeestatus = ?, epaystatus = ?, telegram = ?, updatedAt = ? WHERE id = ?",
      [name, description, employeestatus, epaystatus, telegram, updatedAt, id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

playersdb.updatePlayerBalance = (balance, id) => {
  return new Promise((resolve, reject) => {
    const updatedAt = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    pool.query(
      "UPDATE players SET balance = ?, updatedAt = ? WHERE id = ?",
      [balance, updatedAt, id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

playersdb.updatePlayerTips = (tips, id) => {
  return new Promise((resolve, reject) => {
    const updatedAt = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    pool.query(
      "UPDATE players SET tips = ?, updatedAt = ? WHERE id = ?",
      [tips, updatedAt, id],
      (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      }
    );
  });
};

module.exports = playersdb;
