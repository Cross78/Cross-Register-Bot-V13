const mongoose = require('mongoose');

let statSema = new mongoose.Schema({
guildID: String,
userID: String,
Man: { type: Number, default: 0 },
    Woman: { type: Number, default: 0 },
    Total: { type: Number, default: 0 },
})

module.exports = mongoose.model("stat", statSema)