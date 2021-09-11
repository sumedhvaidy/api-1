const express = require("express");
require("./db/connection");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());