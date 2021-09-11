const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getEventsModel = new Schema({
    "id": String,
            "name": String,
            "description": String,
            "startTime": String,
            "endTime": String,
            "location": String,
            "sponsor": String,
})

const EventsModel = mongoose.model('EventModel', getEventsModel);

module.exports = EventsModel;
