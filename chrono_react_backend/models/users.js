const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // token:    { type: String, required: true }, //pas besoin car JWT ici
    times: [{type: mongoose.Schema.Types.ObjectId, ref: 'Time'}],
})

const User = mongoose.model('User', userSchema);
module.exports = User
