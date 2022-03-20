const Discord = require("discord.js");
const ayar = require('../settings.js');
const {Cevap, Register} = require('../helpers/functions.js');
module.exports.run = async(client, message, args, embed) => {
if(!Register.checkPerms(message.member)) return Cevap.yetki(message)
let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
args = args.filter(a => a !== "" && a !== " ").splice(1)
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if(!member) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bir kullanıcı belirtmelisin. `)]}).sil(7);
    var name = Register.fixname(member, isim, yaş);
    if(member.user.bot) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kayıt ettiğin kullanıcı bir bot olamaz!`)]}).sil(7);
    if(member.user.id == message.member.id) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kendini kayıt edemezsin!`)]}).sil(7);
    if(member.user.id == message.guild.ownerId) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Sunucu sahibini kayıt edemezsin!`)]}).sil(7);
    if(member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bu kullanıcı sizden üst/aynı pozisyonda.`)]}).sil(7);
 await member.setNickname(name).then(async m => {
await message.channel.send({embeds: [embed.setDescription(`${member}, Adlı kullanıcının ismi \`${member.displayName}\` olarak değiştirildi!`)]}).sil(7)
 }).catch(e => {});
   
};
exports.config = {
    name: "isim",
    usage: `${ayar.bot.botPrefix}isim [@Cross/ID] (Name) (Age)`,
    guildOnly: true,
    aliases: ["name","i"],
    cooldown: 3000
};