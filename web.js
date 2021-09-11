require("dotenv").config();

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const router = require("./router");
const EventModel = require('./models/getEventsModel');

const bodyParser = require('body-parser');

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }); 
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connection to db established"));
exports.db = db;

app.use(express.json());

app.get('/events', async (req, res) => {
    try {
        const events = await EventModel.find({});
        res.status(200).send(events);
    } catch(error) {
        res.status(500).send(error);
    }
})

app.listen(process.env.PORT, () => console.log(`server has started at port ${process.env.PORT}`));