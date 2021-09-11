const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postEventsModel = new Schema({
            "name": {type: String, required: true},
            "description": {type: String, required: true},
            "startTime": {type: String, required: true},
            "endTime": {type: String, required: true},
            "location": {type: String, required: true},
            "sponsor": {type: String, required: true},
})

const PostEventsModel = mongoose.model('PostEventModel', postEventsModel);

module.exports = PostEventsModel;
