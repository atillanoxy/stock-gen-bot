const Discord = require('discord.js');

module.exports = {
    name: 'satınal',
    description: 'VIP aboneliği satın almak için bilgi alın.',
    execute(message, args) {
        const embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('GELTA ABONELİK FİYATI')
            .setDescription('Satın almak için aşağıdaki linklere tıklayabilirsiniz:')
            .addFields(
                { name: 'Aylık Abonelik', value: '[Aylık Abonelik Satın Al](https://www.itempazar.com/discord-uye-nitro-sunucu/gelta-aylik-vip-uyelik-161956)', inline: true },
                { name: 'Haftalık Abonelik', value: '[Haftalık Abonelik Satın Al](https://www.itempazar.com/discord-uye-nitro-sunucu/gelta-haftalik-vip-uyelik-161957)', inline: true }
            );

        message.channel.send({ embeds: [embed] });
    },
};
