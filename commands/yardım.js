const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'yardım',
    description: 'Tüm komutları gösterir.',
    execute(message, args) {
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Komut Listesi')
            .setDescription('İşte mevcut komutlar:')
            .addFields(
                { name: '!chatedit', value: 'Belirli bir değişken için belirtilen metin kanalının IDsini ayarlar.json dosyasındaki değişkene tanımlar. !chatedit <değişken> <#kanal>' },
                { name: '!roledit', value: 'Belirli bir değişken için belirtilen rolün IDsini ayarlar.json dosyasındaki değişkene tanımlar. !roleedit <değişken> <@rol>' },
                { name: '!satınal', value: 'VIP aboneliği satın almak için bilgi alın.' },
                { name: '!kodkullan', value: 'Satın aldığınız Vip aboneliği etkinleştirin. !kodkullan <kod>' },
                { name: '!gen', value: 'İstediğiniz abonelikten istediğiniz servisin hesabını üretmek için kullanın !gen <abonelik> <servis>' },
                { name: '!vipcreate', value: 'Belirli bir sayıda ve türde VIP kodları oluşturur ve sahibe DM üzerinden teslim eder.(SADECE OWNER) !vipcreate <üretileceksayı> <haftalık/aylık>' },
                { name: '!ping', value: 'Botun ve api pingini görüntüleyin.' },
                // Buraya komutlarınızı ve açıklamalarını ekleyin
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
