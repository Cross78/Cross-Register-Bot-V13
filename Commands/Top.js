const Discord = require("discord.js");
const ayar = require('../settings.js');
const {Cevap, Register} = require('../helpers/functions.js');
const statData = require('../Models/Stats')
module.exports.run = async(client, message, args, embed) => {
    if(!Register.checkPerms(message.member)) return Cevap.yetki(message)
    let data = await statData.find({guildID: message.guild.id})
if(!data.length) return message.channel.send({embeds: [embed.setDescription(`${message.member} Sunucuya ait veri bulunamadı!`)]}).sil(7)
let top = data.filter(s => message.guild.members.cache.has(s.userID) && s.Total > 0).sort((a, b) => b.Total - a.Total).map((value, index) => `\`${index +1}.\` ${message.guild.members.cache.get(value.userID)} toplam **${value.Total}** (Erkek **${value.Man}** - Kadın **${value.Woman}** )`).slice(0, 15).join('\n')
message.channel.send({embeds: [embed.setAuthor({name: message.guild.name, iconURL: message.guild.iconURL({dynamic: true})}).setDescription(`Sunucuya ait ilk 15 kayıt verisi; \n\n${top}`)]})
};
exports.config = {
    name: "top",
    usage: `${ayar.bot.botPrefix}top `,
        guildOnly: true,
    aliases: ["topteyit"],
    cooldown: 3000
};