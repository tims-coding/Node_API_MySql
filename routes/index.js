const express = require("express");
require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_TEST);
const db_admins = require("../db/db_admins");
const db_players = require("../db/db_players");
const db_transactions = require("../db/db_transactions");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const router = express.Router();

////////////////////// Registration ///////////////////////////

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    await db_admins.register(username, password);
    res.json(req.body);
  } catch (error) {
    res.sendStatus(409);
  }
});

////////////////////// Login ///////////////////////////

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    let results = await db_admins.login(username, password);
    res.json(results);
  } catch (error) {
    res.sendStatus(409);
  }
});

////////////////////// Players Table //////////////////////////
// router.get("/players", async (req, res) => {
//   try {
//     let results = await db_players.getAllPlayers();
//     res.json(results);
//   } catch (error) {
//     res.sendStatus(500);
//     console.log(error);
//   }
// });

router.get("/players/:token", async (req, res) => {
  try {
    let results = await db_players.allPlayers(req.params.token);
    res.json(results);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

router.get("/players/user/:id", async (req, res) => {
  try {
    let results = await db_players.onePlayer(req.params.id);
    res.json(results);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

router.post("/players/post", async (req, res) => {
  const { name, gameToken } = req.body;
  try {
    await db_players.addPlayer(name, gameToken);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
});

router.delete("/players/delete/:id", async (req, res) => {
  try {
    await db_players.deletePlayer(req.params.id);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
});

router.put("/players/edit/:id", async (req, res) => {
  const { name, description, employeestatus, epaystatus, telegram, id } =
    req.body;
  try {
    await db_players.updatePlayer(
      name,
      description,
      employeestatus,
      epaystatus,
      telegram,
      id
    );
    res.send(req.body);
  } catch (error) {
    console.log(error);
  }
});

router.put("/players/edit/balance/:id", async (req, res) => {
  const { balance, id } = req.body;
  try {
    await db_players.updatePlayerBalance(balance, id);
    res.send(req.body);
  } catch (error) {
    console.log(error);
  }
});

router.put("/players/edit/tips/:id", async (req, res) => {
  const { tips, id } = req.body;
  try {
    await db_players.updatePlayerTips(tips, id);
    res.send(req.body);
  } catch (error) {
    console.log(error);
  }
});

////////////////////// Transactions Table //////////////////////////
router.get("/transactions/:token", async (req, res) => {
  try {
    let results = await db_transactions.all(req.params.token);
    res.json(results);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

router.get("/transactions/user/:id", async (req, res) => {
  try {
    let results = await db_transactions.one(req.params.id);
    res.json(results);
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
});

router.post("/transactions/post", async (req, res) => {
  const { id, name, amount, transaction, note, gameToken } = req.body;
  try {
    await db_transactions.add(id, name, amount, transaction, note, gameToken);
    res.json(req.body);
  } catch (error) {
    console.log(error);
  }
});

///////////////////// Telegram API //////////////////////////
router.post("/telegram", async (req, res) => {
  const { message, chatID } = req.body;
  const token = process.env.TELEGRAM_API;
  const bot = new TelegramBot(token, { polling: false });
  await bot.sendMessage(chatID, message);
  res.send(message);
});

//////////////////// Stripe Payments API ////////////////////
router.post("/stripe/charge", async (req, res) => {
  console.log("stripe-routes.js 9 | route reached", req.body);
  let { id } = req.body;
  console.log("stripe-routes.js 10 | id", id);
  try {
    const payment = await stripe.paymentIntents.create({
      amount: "100",
      currency: "USD",
      description: "one month subscription",
      payment_method: id,
      confirm: true,
    });
    console.log("stripe-routes.js 19 | payment", payment);
    res.json({
      message: "Payment Successful",
      success: true,
    });
  } catch (error) {
    console.log("stripe-routes.js 17 | error", error);
    res.json({
      message: "Payment Failed",
      success: false,
    });
  }
});

module.exports = router;
