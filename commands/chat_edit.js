const { Permissions } = require('discord.js');
const fs = require('fs').promises;

module.exports = {
    name: 'chatedit',
    description: 'Belirli bir değişken için belirtilen metin kanalının IDsini ayarlar.json dosyasındaki değişkene tanımlar.',
    usage: '<değişken> <#kanal>',
    async execute(message, args) {
        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return message.reply('Bu komutu kullanma izniniz yok.');
        }

        if (args.length !== 2) {
            return message.reply('Lütfen değişken ve kanalı belirtin.');
        }

        const variable = args[0].toLowerCase();
        const channelMention = message.mentions.channels.first();

        if (!channelMention) {
            return message.reply('Lütfen bir kanal etiketleyin.');
        }

        const channelID = channelMention.id;

        // Değişkenler
        const variables = ['free', 'boost', 'vip'];

        if (!variables.includes(variable)) {
            return message.reply('Geçersiz değişken. Lütfen free, boost veya vip seçin.');
        }

        // Ayarlar.json dosyasındaki kanalları al
        try {
            let settings = JSON.parse(await fs.readFile('./ayarlar.json', 'utf-8'));
            settings.channels[`${variable}_chat_id`] = channelID;

            // Ayarları güncelle
            await fs.writeFile('./ayarlar.json', JSON.stringify(settings, null, 4));

            message.reply(`Başarıyla ${variable}_chat_id ayarlandı ve kanal atandı.`);
        } catch (error) {
            console.error('Ayarlar dosyası güncellenirken bir hata oluştu:', error);
            message.reply('Ayarlar dosyası güncellenirken bir hata oluştu.');
        }
    },
};