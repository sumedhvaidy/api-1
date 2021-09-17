require("dotenv").config();

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const GetEventsModel = require('./models/getEventsModel');
const bodyParser = require('body-parser');
const PostEventsModel = require("./models/postEventsModel");

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }); 
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connection to db established"));
exports.db = db;

app.use(express.json());

app.get('/events/', async (req, res) => {
    try {
        const events = await GetEventsModel.find({});
        res.status(200).send({events: events});
    } catch(error) {
        res.status(500).send(error);
    }
})

app.post('/events', async (req, res) => {
    try {
        const event = new PostEventsModel(req.body);
        await event.save();
        res.status(200).send(event);
    } catch(error) {
        res.status(400).send(error);
    }
})

app.delete('/events/:id', async (req, res) => {
    try {
        const event = await GetEventsModel.findByIdAndDelete(req.params.id);
        if(!event) {
            return res.status(404).send();
        }
        res.status(200).send(event);
    } catch(error) {
        res.status(500).send(error);
    }
})

app.listen(process.env.PORT, () => console.log(`server has started at port ${process.env.PORT}`));