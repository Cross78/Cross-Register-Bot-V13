const mongoose = require('mongoose');

let mods = new mongoose.Schema({
guildID: String,
tagMode: {type: Boolean, default: false},
nameMode: {type: Boolean, default: false},
})

module.exports = mongoose.model("Mods", mods)