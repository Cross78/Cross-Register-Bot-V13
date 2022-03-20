const Discord = require("discord.js")
const client = new Discord.Client({ 'intents': [32767, "GUILD_INVITES"]});
const ayar = require("./settings.js")
const fs = require("fs");
require('./util/Loader.js')(client);
const moment = require('moment');
moment.locale('tr');
const mongoose = require('mongoose');
mongoose.connect(ayar.bot.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(m => setTimeout(() => { console.log('Database bağlandı!') }, 3000)).catch(err => setTimeout(() => { console.log('Database bağlanamadı!!') }, 3000));
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./Commands/', (err, files) => {
    if (err) console.error(err);
    console.log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./Commands/${f}`);
        console.log(`${props.config.name} komutu yüklendi.`);
        client.commands.set(props.config.name, props);
        props.config.aliases.forEach(alias => {
            client.aliases.set(alias, props.config.name);
        });
    });
})

client.login(ayar.bot.botToken).catch(err => { console.log('Bota giriş yapılırken başarısız olundu!!') })

client.on("messageCreate", async message => {
    if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayar.bot.botPrefix)) return;
    if (!ayar.bot.botOwner.includes(message.author.id) && message.author.id !== message.guild.ownerId) return;
    let args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0].slice(ayar.bot.botPrefix.length);
    //let embed = new Discord.MessageEmbed().setColor("#00ffdd").setAuthor({text: message.author.tag, url:  message.author.avatarURL({ dynamic: true, })}).setFooter({text: `Cross was here!`}).setTimestamp();
    
    // Eval
    if (command === "eval" && ayar.bot.botOwner.includes(message.author.id)) {
      if (!args[0]) return message.channel.send(`Kod belirtilmedi`);
        let code = args.join(' ');
        function clean(text) {
        if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
        text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
        return text;
      };
      try { 
        var evaled = clean(await eval(code));
        if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
        message.channel.send({content: `
        
        \`\`\`${evaled.replace(client.token, "Yasaklı komut")}\`\`\`
        `, code: "js", split: true});
      } catch(err) { message.channel.send({content: `${err}`, code: 'js', split: true})
    }
}
})

client.on("ready", async () => {
  client.guilds.cache.forEach(guild => {
    guild.invites.fetch().then(invites => guildInvites.set(guild.id, invites)).catch(err => console.log(err));
  });
});  
const guildInvites = new Map()
client.on("inviteCreate", async invite => {
   guildInvites.set(invite.guild.id, await invite.guild.invites.fetch())});
client.on("inviteDelete", invite => setTimeout(async () => { guildInvites.set(invite.guild.id, await invite.guild.invites.fetch()); }, 5000));
const Database = require('./Models/İnvite.js');
client.on("guildMemberAdd", async member => {
  if(!member) return;
  if (ayar.guild.tags.some(s => member.user.username.includes(s) || member.user.discriminator.includes(s) || member.user.tag.includes(s))) await member.roles.add(ayar.roles.tagRole).catch(e => {})
  let cachedInvites = await guildInvites.get(member.guild.id);
  let newInvites = await member.guild.invites.fetch();
  let usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses) || cachedInvites.find(inv => newInvites.has(inv.code)) || {code: member.guild.vanityURLCode, uses: null, inviter: {id: null}};
  let inviter = client.users.cache.get(usedInvite.inviterId) || {id: member.guild.id};
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
  Database.findOne({ guildID: member.guild.id, userID: member.id }, (err, joinedMember) => {
    if (!joinedMember) {
      let newJoinedMember = new Database({
          _id: new mongoose.Types.ObjectId(),
          guildID: member.guild.id,
          userID: member.id,
          inviterID: inviter.id,
          regular: 0,
          bonus: 0,
          fake: 0
      });
      newJoinedMember.save();
    } else {
      joinedMember.inviterID = inviter.id;
      joinedMember.save();
    };
  });
  if (isMemberFake) {
      let olusturma = `(\`${moment.duration(Date.now() - member.user.createdTimestamp).locale('tr').format('Y [yıl], M [Ay], D [Gün]')}\`)`
      await member.roles.set([ayar.roles.suspecious]).catch(e => {});
await member.setNickname(ayar.guild.suspeciousName).catch(e => {});
let channel = client.channels.cache.get(ayar.channels.registerChannel)
//if(channel) channel.send(`

    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
      if (!inviterData) {
        let newInviter = new Database({
          _id: new mongoose.Types.ObjectId(), 
          guildID: member.guild.id,
          userID: inviter.id,
          inviterID: null,
          regular: 0,
          bonus: 0,
          fake: 1
        });
        newInviter.save().catch( x => {});
      } else {
                 member.roles.set([ayar.roles.suspeciousRole]).catch(e => {});
 member.setNickname(ayar.guild.suspeciousName).catch(e => {});

if(channel) channel.send(`
${member}, Adlı kullanıcı sunucuya katıldı fakat hesabı yeni olduğu için şüpheli hesap rolünü verdim. ${olusturma}`);
        inviterData.fake++
        inviterData.save().catch(x => {});
      };
    });
  } else {
        member.roles.add(ayar.roles.unregisterRoles).catch(e => {});
             member.setNickname(ayar.guild.defaultName).catch(e => {});
    Database.findOne({ guildID: member.guild.id, userID: inviter.id }, (err, inviterData) => {
        if (!inviterData) {
          let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 1,
            bonus: 0,
            fake: 0
          });
          newInviter.save().then(x => {
           client.channels.cache.get(ayar.channels.registerChannel).send(`
:tada: Sunucumuz'a hoş geldin ${member}!
                
Hesabın ${moment(member.user.createdTimestamp).locale('tr').format('LLL')} tarihinde (${moment.duration(Date.now() - member.user.createdTimestamp).locale('tr').format('Y [yıl], M [Ay], D [Gün]')}) önce oluşturulmuş.

Sunucu kurallarımız ${client.channels.cache.get(ayar.channels.rulesChannel)} kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.

${client.users.cache.has(inviter.id) ? inviter : "**Özel URL**"} tarafından davet edilerek Sunucumuzun **${member.guild.memberCount}**. üyesi olmanı sağladı! İyi eğlenceler :tada::tada::tada:`)
        });
        } else {
              member.roles.add(ayar.roles.unregisterRoles).catch(e => {});
             member.setNickname(ayar.guild.defaultName).catch(e => {});
          inviterData.regular++;
          inviterData.save().then(x => {
          client.channels.cache.get(ayar.channels.registerChannel).send(`
:tada: Sunucumuz'a hoş geldin ${member}!
                
Hesabın ${moment(member.user.createdTimestamp).locale('tr').format('LLL')} tarihinde (${moment.duration(Date.now() - member.user.createdTimestamp).locale('tr').format('Y [yıl], M [Ay], D [Gün]')}) önce oluşturulmuş.

Sunucu kurallarımız ${client.channels.cache.get(ayar.channels.rulesChannel)} kanalında belirtilmiştir. Unutma sunucu içerisinde ki ceza işlemlerin kuralları okuduğunu varsayarak gerçekleştirilecek.

${client.users.cache.has(inviter.id) ? inviter : "**Özel URL**"} tarafından davet edilerek Sunucumuzun ${member.guild.memberCount} üyesi olmanı sağladı! İyi eğlenceler :tada::tada::tada:`)
        });
        };
      });
  };
  guildInvites.set(member.guild.id, newInvites);
});

client.on("guildMemberRemove", async member => {
  let isMemberFake = (Date.now() - member.user.createdTimestamp) < 7*24*60*60*1000;
  Database.findOne({ guildID: member.guild.id, userID: member.id }, async (err, memberData) => {
    if (memberData && memberData.inviterID) {
      let inviter = client.users.cache.get(memberData.inviterID) || {id: member.guild.id};
      Database.findOne({ guildID: member.guild.id, userID: memberData.inviterID }, async (err, inviterData) => {
        if (!inviterData) {
         let newInviter = new Database({
            _id: new mongoose.Types.ObjectId(),
            guildID: member.guild.id,
            userID: inviter.id,
            inviterID: null,
            regular: 0,
            bonus: 0,
            fake: 0
          });
          newInviter.save();
        } else {
          if (isMemberFake) {
            if (inviterData.fake-1 >= 0) inviterData.fake--;
          } else {
            if (inviterData.regular-1 >= 0) inviterData.regular--;
          };
          inviterData.save().catch(x => {});
        };
      });
    } else {
    };
  });
});