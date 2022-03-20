const Discord = require("discord.js");
const ayar = require('../settings.js');
const modsData = require('../Models/Mods');
module.exports = async client => {
    let data = await modsData.findOne({guildID: ayar.guild.guildID})
    if(!data) await new modsData({guildID: ayar.guild.guildID, tagMode: false, nameMode:false}).save();
    console.log('' + client.user.tag + ' ismiyle giriş yapıldı!')
    client.user.setActivity("Cross was here!");
    client.user.setStatus('dnd');
    
};