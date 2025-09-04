const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
    date: {type: Date, default: Date.now},
    duration: {type: Number, required: true,},
    // user: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true,},
});

const Time = mongoose.model('Time', timeSchema);
module.exports = Time;