const express = require("express");
const apiRouter = require("./routes");
require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/users", apiRouter);

app.listen(3002, () => {
  console.log("Server running on port 3002");
});
