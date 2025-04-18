const mongoose = require('mongoose');

const timeSchema = new mongoose.Schema({
    time: {type: Number, required: true,},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true,},
});

const Time = mongoose.model('Time', timeSchema);
module.exports = Time;