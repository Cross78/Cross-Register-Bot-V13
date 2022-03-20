const mongoose = require('mongoose');

let registerSema = new mongoose.Schema({
guildID: String,
userID: String,
Name: String,
Sex: String,
Date: Number,
})

module.exports = mongoose.model("register", registerSema)