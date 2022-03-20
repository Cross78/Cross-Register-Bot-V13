const Discord = require("discord.js");
const ayar = require('../settings.js');
const {} = require('../helpers/functions.js');
module.exports.run = async(client, message, args, embed) => {
let mapped = client.commands.map((qwe) => `**${qwe.config.usage}**`).join('\n')
message.channel.send({embeds: [embed.setDescription(`Botta toplamda **${client.commands.size}** komut bulunmaktadır. \n \`Not:\` **()** İsteğe bağlı, **[]** zorunlu! \n ${mapped}`)]})
};
exports.config = {
    name: "yardım",
    usage: `${ayar.bot.botPrefix}help`,
        guildOnly: true,
    aliases: ["help"],
    cooldown: 3000
};