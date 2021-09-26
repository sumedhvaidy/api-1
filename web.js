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
        const startTime = req.body.json()['startTime'].match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})\Z$/);
        const endTime = req.body.json()['endTime'].match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})\Z$/);
        if(isValidDate(startTime) && isValidDate(endTime) && timesAreValid(startTime, endTime)) {
            await event.save();
            res.status(200).send({event: event});
        } else {
            res.status(400).send(error);
        }
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
        res.status(200).send({event: event});
    } catch(error) {
        res.status(500).send(error);
    }
})

app.patch('/events/:id', async (req, res) => {
    try {
        const startTime = req.body.json()['startTime'].match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})\Z$/);
        const endTime = req.body.json()['endTime'].match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})\Z$/);
        if(isValidDate(startTime) && isValidDate(endTime) && timesAreValid(startTime, endTime)) {
            const event = await GetEventsModel.findByIdAndUpdate(req.params.id, req.body, {new: true});
            if(!event) {
                return res.status(404).send()
            }
            res.status(200).send({event: event});
        } else {
            res.status(400).send(error);
        }
    } catch(error) {
        res.status(500).send(error);
    }
})

app.get('/events/:id', async (req, res) => {
    try {
        const event = await GetEventsModel.findById(req.params.id);
        if(!event) {
            return res.status(404).send()
        }
        res.status(200).send({event: event});
    } catch(error) {
        res.status(500).send(error);
    }
})

function isValidDate(matches) {
    // Reference: https://stackoverflow.com/questions/20972728/validate-datetime-with-javascript-and-regex
    if (matches === null) {
        return false;
    } else{
        // now lets check the date sanity
        var date = toDateObject(matches);
        if (date.getFullYear() !== year
            || date.getMonth() != month
            || date.getDate() !== day
            || date.getHours() !== hour
            || date.getMinutes() !== minute
            || date.getSeconds() !== second
        ) {
            return false;
        } 
    }
    return true;
}

function timesAreValid(startTime, endTime) {
    if(startTime === null || endTime === null) {
        return false;
    }
    return toDateObject(startTime) <= toDateObject(endTime);
}

function toDateObject(time) {
    try {
        const year = parseInt(time[3], 10);
        const month = parseInt(time[2], 10) - 1; // months are 0-11
        const day = parseInt(time[1], 10);
        const hour = parseInt(time[4], 10);
        const minute = parseInt(time[5], 10);
        const second = parseInt(time[6], 10);
        return new Date(year, month, day, hour, minute, second);
    } catch(error) {
        return null;
    }
}

app.listen(process.env.PORT, () => console.log(`server has started at port ${process.env.PORT}`));