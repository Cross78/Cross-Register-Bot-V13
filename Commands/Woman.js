const Discord = require("discord.js");
const ayar = require('../settings.js');
const {Cevap, Register} = require('../helpers/functions.js');
const modsData = require('../Models/Mods.js')

module.exports.run = async(client, message, args, embed) => {
if(!Register.checkPerms(message.member)) return Cevap.yetki(message)
let member = message.guild.members.cache.get(args[0]) || message.mentions.members.first();
args = args.filter(a => a !== "" && a !== " ").splice(1)
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase() + arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || undefined;
    if(!member) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bir kullanıcı belirtmelisin. `)]}).sil(7);
    var name = Register.fixname(member, isim, yaş);
    if(name.length > 32) return message.channel.send({embeds: [embed.setDescription(`${message.member}, İsim 32 karakterden fazla olamaz!`)]}).sil(7)

    if(member.user.bot) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kayıt ettiğin kullanıcı bir bot olamaz!`)]}).sil(7);
    if(member.user.id == message.member.id) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kendini kayıt edemezsin!`)]}).sil(7);
    if(member.user.id == message.guild.ownerId) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Sunucu sahibini kayıt edemezsin!`)]}).sil(7);
    if(member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bu kullanıcı sizden üst/aynı pozisyonda.`)]}).sil(7);
   if(ayar.roles.manRoles.some(s => member.roles.cache.has(s)) || ayar.roles.womanRoles.some(x => member.roles.cache.has(x))) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bu kullanıcı zaten kayıtlı.`)]}).sil(7);
   if(!ayar.roles.unregisterRoles.some(s => member.roles.cache.has(s))) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kullanıcıda kayıtsız rolü bulunmadığı için işlem gerçekleştirilemedi.`)]}).sil(7);
 
   let data = await modsData.findOne({guildID: message.guild.id});
   if(data.tagMode == true) {
       if(ayar.guild.tags.some(x => member.user.username.includes(x) || member.user.discriminator.includes(x)  || member.roles.cache.has(ayar.roles.vipRole) || member.roles.cache.has(ayar.roles.boosterRole))) {
        await Register.Woman(member, message.member, name, message.channel)

       }  else {
         return  message.channel.send({embeds: [embed.setDescription(`${message.member}, Kullanıcıda tag bulunmadığı için kayıt işlemi gerçekleştirilemedi.`)]}).sil(7)}
   } else {
    await Register.Woman(member, message.member, name, message.channel)
   }
};
exports.config = {
    name: "kadın",
    usage: `${ayar.bot.botPrefix}kız [@Cross/ID] (Name) (Age)`,
    guildOnly: true,
    aliases: ["kız","k","woman"],
    cooldown: 3000
};