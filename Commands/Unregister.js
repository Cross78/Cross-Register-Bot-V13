const Discord = require("discord.js");
const ayar = require('../settings.js');
const {Cevap, Register} = require('../helpers/functions.js');
module.exports.run = async(client, message, args, embed) => {
if(!Register.checkPerms(message.member)) return Cevap.yetki(message)
let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
if(!member) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bir kullanıcı belirtmelisin. `)]}).sil(7);
if(member.user.bot) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kayıtsıza attığın kullanıcı bir bot olamaz!`)]}).sil(7)
if(member.user.id == message.member.id) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kendini kayıtsıza atamazsın!`)]}).sil(7);
if(member.user.id == message.guild.ownerId) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Sunucu sahibini kayıtsıza atamazsın!`)]}).sil(7);
if(member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bu kullanıcı sizden üst/aynı pozisyonda.`)]}).sil(7);
if(member.roles.cache.has(ayar.roles.boosterRole)) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Booster bir kullanıcıyı kayıtsıza atamazsın!`)]}).sil(7);
if(ayar.roles.unregisterRoles.some(s => member.roles.cache.has(s))) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bu kullanıcı zaten kayıtsız!`)]}).sil(7);

await member.roles.set(ayar.roles.unregisterRoles).catch();
await member.setNickname(ayar.guild.defaultName).catch();
await message.channel.send({embeds: [embed.setDescription(`${member}, Adlı kullanıcı başarıyla kayıtsıza atıldı!`)]}).sil(7);
};
exports.config = {
    name: "kayıtsız",
    usage: `${ayar.bot.botPrefix}kayıtsız [@Cross/ID]`,
    guildOnly: true,
    aliases: ["unregister"],
    cooldown: 3000
};