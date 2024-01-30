const { Permissions } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'roledit',
    description: 'Belirli bir değişken için belirtilen rolün IDsini ayarlar.json dosyasındaki değişkene tanımlar.',
    usage: '<değişken> <rol>',
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        if (args.length !== 2) {
            return message.reply('Lütfen değişken ve rolü belirtin.');
        }

        const variable = args[0].toLowerCase();
        const roleMention = message.mentions.roles.first();
        
        if (!roleMention) {
            return message.reply('Lütfen bir rol etiketleyin.');
        }

        const roleID = roleMention.id;

        // Değişkenler
        const variables = ['free', 'boost', 'vip'];

        if (!variables.includes(variable)) {
            return message.reply('Geçersiz değişken. Lütfen free, boost veya premium seçin.');
        }

        // Ayarlar.json dosyasındaki rolleri al
        let settings = JSON.parse(fs.readFileSync('./ayarlar.json', 'utf8'));
        settings.roles[`${variable}_role_id`] = roleID;

        // Ayarları güncelle
        try {
            await fs.promises.writeFile('./ayarlar.json', JSON.stringify(settings, null, 4));
            message.reply(`Başarıyla ${variable}_role_id ayarlandı ve rol atandı.`);
        } catch (error) {
            console.error('Ayarlar dosyası güncellenirken bir hata oluştu:', error);
            message.reply('Ayarlar dosyası güncellenirken bir hata oluştu.');
        }
    },
};
