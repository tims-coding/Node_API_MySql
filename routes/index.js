const express = require("express");
const db = require("../db");
const db_packages = require("../db_packages");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const router = express.Router();

router.get("/flights", async (req, res) => {
  const api_url = `http://api.aviationstack.com/v1/flights?access_key=${process.env.FLIGHT_API_KEY}&flight_iata=UA8500`;
  const fetch_response = await fetch(api_url);
  const flights = await fetch_response.json();
  res.json(flights);
});

router.get("/", async (req, res) => {
  try {
    let results = await db.all();
    res.json(results);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

router.get("/packages", async (req, res) => {
  try {
    let results = await db_packages.allPackages();
    res.json(results);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let results = await db.one(req.params.id);
    res.json(results);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

router.post("/post", async (req, res) => {
  const { name, guests, package, id } = req.body;
  try {
    await db.add(name, guests, package, id);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    await db.delete(req.params.id);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
});

router.put("/edit/:id", async (req, res) => {
  const { name, guests, package, id } = req.body;
  try {
    await db.update(name, guests, package, id);
    res.send(req.body);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
