"use strict";
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config");
const defaultRouter = require("./routes/routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.use("/api", defaultRouter.routes);

app.listen(8080, () =>
  console.log("App is listening on port " + "8080")
);
