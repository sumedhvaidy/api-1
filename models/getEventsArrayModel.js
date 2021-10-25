const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const getEventsArrayModel = new Schema({
    "id": String,
    "name": String,
            "description": String,
            "startTime": String,
            "endTime": String,
            "location": String,
            "sponsor": String,
            "checkInCode": String,
    "checkIns": [String]
})

const GetEventsArrayModel = mongoose.model('GetEventsArrayModel', getEventsArrayModel, 'events');

module.exports = GetEventsArrayModel;
