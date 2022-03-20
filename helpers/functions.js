const { MessageEmbed } = require('discord.js');
const ayar = require('../settings');
const client = global.client;
const moment = require('moment');
require('moment-duration-format');
const message = require('../Events/message');
let embed = new MessageEmbed().setColor('RANDOM').setTimestamp().setFooter({text: 'Cross was here.'})
const modsData = require('../Models/Mods.js')
const registerData = require('../Models/Register')
const statData = require('../Models/Stats')

Promise.prototype.sil = function(time) {
    if (this) this.then(s => {
        if (s.deletable) {
setTimeout(async() => {
    s.delete().catch(e => {});
}, time * 1000)
        } 
    });
};


class Cevap {
static yetki(msg) {
    let embd = embed.setDescription(`${msg.author}, Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`)
msg.channel.send({embeds: [embd]}).sil(7);
}
static async tagacik(msg, bt, row) { 
await bt.reply({embeds: [embed.setDescription(`Taglı alım modu zaten aktif!`)], ephemeral: true})


} 
static async tagacildi(msg, bt, row) {
  await  bt.reply({embeds: [embed.setDescription(`Taglı alım modu başarıyla aktif edildi!`)], ephemeral: true})
  
}
static async tagkapali(msg, bt, row) { 
    await bt.reply({embeds: [embed.setDescription(`Taglı alım modu zaten deaktif!`)], ephemeral: true})
    
    }
    static async tagkapandi(msg, bt, row) { 
        await bt.reply({embeds: [embed.setDescription(`Taglı alım modu başarıyla deaktif edildi!`)], ephemeral: true})
        
    }
    static async tagsec(msg, b) { 
        let data = await modsData.findOne({guildID: msg.guild.id})
        await msg.channel.send({embeds: [embed.setDescription(`Tag modu işlemleri için aşağıdaki butonları kullanabilirsiniz. Şuanda **( ${data.tagMode == true ? 'Açık!' : 'Kapalı!'} )**`)], components: [b]}).sil(10)
    }
    static async isimsec(msg, b) {
        
        let data = await modsData.findOne({guildID: msg.guild.id})
        await msg.channel.send({embeds: [embed.setImage('https://cdn.discordapp.com/attachments/799237507820552193/843813219470409729/unknown.png').setDescription(`İsim modu işlemleri için aşağıdaki butonları kullanabilirsiniz Şuanda **( ${data.nameMode == true ? 'Açık!' : 'Kapalı!'} )**.`)], components: [b]}).sil(10)
    }
    static async isimacik(msg, bt) {
        bt.reply({embeds: [embed.setImage(null).setDescription(`İsim modu zaten aktif!`)], ephemeral: true})
        }
        static async isimacildi(msg, bt) {
          await  bt.reply({embeds: [embed.setImage(null).setDescription(`İsim modu başarıyla aktif edildi!`)], ephemeral: true})
        }
        static async isimkapali(msg, bt) {
           await bt.reply({embeds: [embed.setImage(null).setDescription(`İsim modu zaten deaktif!`)], ephemeral: true})
            }
            static async isimkapandi(msg, bt) {
               await bt.reply({embeds: [embed.setImage(null).setDescription(`İsim modu başarıyla deaktif edildi!`)], ephemeral: true})
            }
}

class Register {

    static async Man(user, admin,name,channel) {
await user.roles.add(ayar.roles.manRoles).catch()
await user.roles.remove(ayar.roles.unregisterRoles).catch()
await user.setNickname(name).catch()
let data = await registerData.find({ guildID: channel.guild.id, userID: user.id })
let x = data.length > 5 ? data.length - (data.length - 5) : data.length

let modData = await modsData.findOne({guildID: channel.guild.id})
        let userData = await registerData.findOne({ guildID: channel.guild.id, userID: user.id })
        let adminData = await statData.findOne({ guildID: channel.guild.id, userID: admin.id })     
        let isimler = data.length > 0 ? data.map((value, i) => `\`${value.Name}\` (${user.guild.roles.cache.get(value.Sex)})`).slice(data.length > 5 ? data.length - 5 : 0, data.length).join('\n') : "Bu kullanıcı daha önce kayıt olmamış!"
        await new registerData({ guildID: channel.guild.id, userID: user.id, Name: name, Sex: ayar.roles.manRoles[0], Date: Date.now() }).save();
        if (!adminData) { new statData({ guildID: channel.guild.id, userID: admin.id, Man: 1, Woman: 0, Total: 1 }).save() } else { adminData.Man++, adminData.Total++, adminData.save(); }
        if (modData && modData.nameMode === true) { channel.send({embeds: [embed.setDescription(`${user} üyesinin ismi başarıyla \`${name}\` olarak değiştirildi. Bu üye daha önce bu isimlerle kayıt olmuş. \n\n ${user.guild.emojis.cache.get(ayar.emojis.yes)} Kişinini toplamda **${x}** isim kayıtı bulundu. \n ${isimler} \n\n Kişinin önceki isimlerine \`.isimler @Cross/ID\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.`)]}).sil(10); } else { channel.send({embeds: [embed.setDescription(`${user} üyesine ${user.guild.roles.cache.get(ayar.roles.manRoles[0])} rolü verildi.`)]}).sil(7); }
        if (ayar.guild.tags.some(s => user.user.username.includes(s) || user.user.discriminator.includes(s) || user.user.tag.includes(s))) await user.roles.add(ayar.roles.tagRole).catch()
   
    }
    static async Woman(user, admin,name,channel) {
        await user.roles.add(ayar.roles.womanRoles).catch()
        await user.roles.remove(ayar.roles.unregisterRoles).catch()
        await user.setNickname(name).catch()
        let data = await registerData.find({ guildID: channel.guild.id, userID: user.id })
        let x = data.length > 5 ? data.length - (data.length - 5): data.length
        let modData = await modsData.findOne({guildID: channel.guild.id})
                let userData = await registerData.findOne({ guildID: channel.guild.id, userID: user.id })
                let adminData = await statData.findOne({ guildID: channel.guild.id, userID: admin.id })     
                let isimler = data.length > 0 ? data.map((value, i) => `\`${value.Name}\` (${user.guild.roles.cache.get(value.Sex)})`).slice(data.length > 5 ? data.length - 5 : 0, data.length).join('\n') : "Bu kullanıcı daha önce kayıt olmamış!"
                await new registerData({ guildID: channel.guild.id, userID: user.id, Name: name, Sex: ayar.roles.womanRoles[0], Date: Date.now() }).save();
                if (!adminData) { new statData({ guildID: channel.guild.id, userID: admin.id, Man: 0, Woman: 1, Total: 1 }).save() } else { adminData.Woman++, adminData.Total++, adminData.save(); }
                if (modData && modData.nameMode === true) { channel.send({embeds: [embed.setDescription(`${user} üyesinin ismi başarıyla \`${name}\` olarak değiştirildi. Bu üye daha önce bu isimlerle kayıt olmuş. \n\n ${user.guild.emojis.cache.get(ayar.emojis.yes)} Kişinini toplamda **${x}** isim kayıtı bulundu. \n ${isimler} \n\n Kişinin önceki isimlerine \`.isimler @Cross/ID\` komutuyla bakarak kayıt işlemini gerçekleştirmeniz önerilir.`)]}).sil(10); } else { channel.send({embeds: [embed.setDescription(`${user} üyesine ${user.guild.roles.cache.get(ayar.roles.womanRoles[0])} rolü verildi.`)]}).sil(7); }
                if (ayar.guild.tags.some(s => user.user.username.includes(s) || user.user.discriminator.includes(s) || user.user.tag.includes(s))) await user.roles.add(ayar.roles.tagRole).catch()
           
            }
    static async checkUser(member, message) {
    if(member.user.bot) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kayıt ettiğin kullanıcı bir bot olamaz!`)]}).sil(7)
    if(member.user.id == message.member.id) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kendini kayıt edemezsin!`)]}).sil(7);
    if(member.user.id == message.guild.ownerId) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Sunucu sahibini kayıt edemezsin!`)]}).sil(7);
    if(member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bu kullanıcı sizden üst/aynı pozisyonda.`)]}).sil(7);
   if(ayar.roles.manRoles.some(s => member.roles.cache.has(s)) || ayar.roles.womanRoles.some(x => member.roles.cache.has(x))) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Bu kullanıcı zaten kayıtlı.`)]}).sil(7);
   if(!ayar.roles.unregisterRoles.some(s => member.roles.cache.has(s))) return message.channel.send({embeds: [embed.setDescription(`${message.member}, Kullanıcıda kayıtsız rolü bulunmadığı için işlem gerçekleştirilemedi.`)]}).sil(7);
 
   let data = await modsData.findOne({guildID: message.guild.id});
   if(!data && !data.length) return new modsData.findOne({guildID: message.guild.id, tagMode: false, nameMode: false}).save();
   if(data.tagMode == true) {
       if(ayar.guild.tags.some(x => member.user.username.includes(x) || member.user.discriminator.includes(x)  || member.roles.cache.has(ayar.roles.vipRole) || member.roles.cache.has(ayar.roles.boosterRole))) {return false } else {
         return  message.channel.send({embeds: [embed.setDescription(`${message.member}, Kullanıcıda tag bulunmadığı için kayıt işlemi gerçekleştirilemedi.`)]}).sil(7)}
   }

    return false;
    }
    static fixname(member, isim, yaş) {
        let fixTag = `${ayar.guild.tags.some(s => member.user.username.includes(s) || member.user.discriminator.includes(s) || member.user.tag.includes(s)) ? ayar.guild.tag : ayar.guild.defaultTag}`
        var name;
        if (yaş) name = `${fixTag} ${isim} | ${yaş}`
        if (!yaş) name = `${fixTag} ${isim}`
        if(!isim && !yaş) name = `${fixTag} ${member.user.username.replaceAll(ayar.guild.tags[0],"").replaceAll(ayar.guild.tags[1], '').replaceAll(ayar.guild.tags[2], '').replaceAll(ayar.guild.tags[3], '').replaceAll(ayar.guild.tags[4], '').replaceAll(ayar.guild.tags[5], '').replaceAll(ayar.guild.tags[6], '')}`
        return name;
    }
    static async checkPerms(user) {
if(!ayar.roles.registerStaff.some(s => user.roles.cache.has(s)) && !user.permissions.has('ADMINISTRATOR')) return true;
return false;
    }

static async tagac(msg, bt, row) {
    let modData = await modsData.findOne({guildID: msg.guild.id})
    
    if(!modData)  { 
        new modsData({guildID: msg.guild.id, tagMode: true, nameMode:false}).save();
       return await Cevap.tagacildi(msg, bt, row);
    }
   if(modData && modData.tagMode == true) { return await Cevap.tagacik(msg, bt, row)} else {modData.tagMode = true; modData.save();  return await Cevap.tagacildi(msg, bt, row)}
    
}
static async tagkapat(msg, bt, row) {
    let data = await modsData.findOne({guildID: msg.guild.id})
    
    if(!data)  { 
        new modsData({guildID: msg.guild.id, tagMode: false, nameMode:false}).save();
       return await Cevap.tagkapandi(msg, bt, row); 
    }
    if(data && data.tagMode == false) { 
        return await Cevap.tagkapali(msg, bt, row);
    } else {
        data.tagMode = false; 
        data.save();  
        await Cevap.tagkapandi(msg, bt, row)
    }
    
}

static async isimkapat(msg, bt) {
    let data = await modsData.findOne({guildID: msg.guild.id})

    if(!data)  { 
        new modsData({guildID: msg.guild.id, tagMode: false, nameMode:false}).save();
       return await Cevap.isimkapandi(msg, bt);
    }
    if(data && data.nameMode == false) { return await Cevap.isimkapali(msg, bt)} else {data.nameMode = false; data.save();  return await Cevap.isimkapandi(msg, bt)}
    
}

static async isimac(msg, bt) {
    let data = await modsData.findOne({guildID: msg.guild.id})

    if(!data)  { 
        new modsData({guildID: msg.guild.id, tagMode: false, nameMode:true}).save();
       return await Cevap.isimacildi(msg);
    }
    if(data && data.nameMode == true) { return await Cevap.isimacik(msg, bt)} else {data.nameMode = true; data.save();  return await Cevap.isimacildi(msg, bt)}
    
}
}
module.exports = { Cevap, Register };

