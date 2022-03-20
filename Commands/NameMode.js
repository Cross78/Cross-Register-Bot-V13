const {MessageButton, MessageActionRow} = require("discord.js");
const ayar = require('../settings.js');
const modsData = require('../Models/Mods.js');
const {Cevap, Register} = require('../helpers/functions.js');
module.exports.run = async(client, message, args, embed) => {
if(!message.member.permissions.has('ADMINISTRATOR')) return Cevap.yetki(message);
let data = await modsData.findOne({guildID: message.guild.id});
let buton1 = new MessageButton().setCustomId('ac').setLabel('Aç!').setStyle('PRIMARY');
let buton2 = new MessageButton().setCustomId('kapat').setLabel('Kapat!').setStyle('SECONDARY');
let buton3 = new MessageButton().setCustomId('iptal').setLabel('İptal!').setStyle('DANGER');
let row1 = new MessageActionRow().addComponents(buton1).addComponents(buton2).addComponents(buton3)
Cevap.isimsec(message, row1)
    let filter = x => x.user.id == message.member.id
    let collector = message.channel.createMessageComponentCollector({filter, time: 10000})
    collector.on('collect', async button => {
    switch(button.customId) {
    case 'ac':
    return await Register.isimac(message, button, row1) 
    break;
    case 'kapat':
   return await Register.isimkapat(message, button,row1) 
     break;
    case 'iptal':
  return  await button.message.delete().catch(e => {}) && await message.delete().catch(e => {}) 
    break;

    }
    })
    
    
};
exports.config = {
    name: "isimmod",
    usage: `${ayar.bot.botPrefix}isimmod`,
    guildOnly: true,
    aliases: ['namemode','namemod'],
    cooldown: 3000
};