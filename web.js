require("dotenv").config();

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const GetEventsModel = require('./models/getEventsModel');
const bodyParser = require('body-parser');
const PostEventsModel = require("./models/postEventsModel");
const GetEventsArrayModel = require("./models/getEventsArrayModel");
const e = require("express");

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }); 
const db = mongoose.connection;
db.on("error", error => console.error(error));
db.once("open", () => console.log("connection to db established"));
exports.db = db;

app.use(express.json());

app.get('/events/', async (req, res) => {
    try {
        const events = await GetEventsModel.find({}).select('-checkIns');
        res.status(200).send({events: events});
    } catch(error) {
        res.status(500).send(error);
    }
})

app.post('/events', async (req, res) => {
    
    try {
        const startTime = req.body.startTime.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})Z$/);
        const endTime = req.body.endTime.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})Z$/);
        if(timesAreValid(startTime, endTime) && (req.body.checkIns === undefined || (Array.isArray(req.body.checkIns) && req.body.checkIns.length === 0))) {
            const event = new PostEventsModel(req.body);
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
        const startTime = req.body.startTime.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})Z$/);
        const endTime = req.body.endTime.match(/^(\d{4})\-(\d{2})\-(\d{2}) (\d{2}):(\d{2}):(\d{2})Z$/);
        if(timesAreValid(startTime, endTime)) {
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

app.post('/events/checkins', async (req, res) => {
    try {        
        const event = await GetEventsArrayModel.findByIdAndUpdate(req.body.eventId.toString(), {$push: {checkIns: req.body.uid.toString()}});
        if(!event) {
            return res.status(404).send()
        }
        res.status(200).send(event);
    } catch(error) {
        res.status(500).send(error);
    }
})

app.get('/events/checkins/:eventId', async (req, res) => {
    try {
        const event = await GetEventsArrayModel.findById(req.params.eventId);
        if(!event) {
            return res.status(404).send()
        }
        res.status(200).send({checkIns: event.checkIns});
    } catch(error) {
        res.status(500).send(error);
    }
})

app.delete('/events/checkins/:eventId', async (req, res) => {
    try {
        const event = await GetEventsArrayModel.findByIdAndUpdate(req.params.eventId.toString(), {$pull: {checkIns: [req.body.uid.toString()]}});
        if(!event) {
            return res.status(404).send()
        }
         res.status(200).send(event);
    } catch(error) {
        res.status(500).send(error);
    }
})

app.get('/events/checkins/user/:uid', async (req, res) => {
    try {
        const events = await GetEventsArrayModel.find({"checkIns": req.params.uid}, "id");

        if(!events) {
            return res.status(404).send();
        }

        const eventIds = [];
        for (var i = 0; i < events.length; i++) {
            eventIds.push(events[i]['_id']);
        }

        res.status(200).send({"events": eventIds});
    } catch(error) {
        res.status(500).send(error);
    }
})

function timesAreValid(startTime, endTime) {
    if(startTime === null || endTime === null) {
        return false;
    }
    return startTime <= endTime;
}
app.listen(process.env.PORT, () => console.log(`server has started at port ${process.env.PORT}`));
