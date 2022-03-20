const {MessageButton, MessageActionRow} = require("discord.js");
const ayar = require('../settings.js');
const modsData = require('../Models/Mods.js');
const {Cevap, Register} = require('../helpers/functions.js');
module.exports.run = async(client, message, args, embed) => {
if(!message.member.permissions.has('ADMINISTRATOR')) return Cevap.yetki(message);
let r = message.guild.roles.cache.get(ayar.roles.vipRole)
if(!r) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Vip rolü girilmemiş.`)]}).sil(7)
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!member) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bir kullanıcı belirt!`)]}).sil(7)
if(member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bu kullanıcı sizden üst/aynı pozisyonda!`)]}).sil(7)
if(member.user.bot) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Botlara vip veremezsin!`)]}).sil(7)
if(member.id == message.member.id) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kendine vip veremezsin!`)]}).sil(7)
if(member.user.id == message.guild.ownerId) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Sunucu sahibine vip veremezsin!`)]}).sil(7);
if(member.roles.cache.has(r.id)) {
await member.roles.remove(r.id).catch(e => {});
await message.channel.send({embeds: [embed.setDescription(`${member}, Adlı kullanıcıdan ${r} rolü alındı!`)]}).sil(7)
} else {
    await member.roles.add(r.id).catch(e => {});
    await message.channel.send({embeds: [embed.setDescription(`${member}, Adlı kullanıcıya ${r} rolü verildi!`)]}).sil(7)
}
};
exports.config = {
    name: "vip",
    usage: `${ayar.bot.botPrefix}vip [Cross/ID]`,
    guildOnly: true,
    aliases: [],
    cooldown: 3000
};