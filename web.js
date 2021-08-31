require("dotenv").config();

const express = require('express');
const app = express();
const mongoose = require("mongoose");

const router = require("./router")

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }); 
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connection to db established"));

app.use(express.json());
app.use(router)

app.listen(process.env.PORT, () => console.log(`server has started at port ${process.env.PORT}`));