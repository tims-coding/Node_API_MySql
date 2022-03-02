const express = require("express");
const apiRouter = require("./routes");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.json());

app.use("/", apiRouter);

app.listen(3002, () => {
  console.log("Server running on port 3002");
});
