const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js');

// Abonelikler ve servisler
const abonelikler = ['free', 'boost', 'vip'];
const servisler = ['steam', 'valorant', 'disney', 'blutv', 'netflix', 'exxen', 'xbox'];

module.exports = {
    name: 'stock',
    description: 'Belirli abonelikteki servislerin stok durumunu gösterir.',
    execute(message, args) {
        if (args.length !== 1) {
            return message.reply('Lütfen doğru parametrelerle komutu kullanın: !stock <abonelik>');
        }

        const abonelik = args[0].toLowerCase();

        if (!abonelikler.includes(abonelik)) {
            return message.reply('Geçersiz abonelik tipi.');
        }

        const projeDizini = path.resolve(__dirname, '..'); // Komut dosyasının bulunduğu dizinden bir üst dizine git

        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle(`Stok Durumu - ${abonelik.charAt(0).toUpperCase() + abonelik.slice(1)}`);

        servisler.forEach(servis => {
            const dosyaYolu = path.join(projeDizini, 'stok', abonelik, `${servis}.txt`);
            if (fs.existsSync(dosyaYolu)) {
                const hesaplar = fs.readFileSync(dosyaYolu, 'utf8').trim().split('\n');
                if (hesaplar.length === 0 || (hesaplar.length === 1 && hesaplar[0] === '')) {
                    embed.addField(capitalizeFirstLetter(servis), 'STOKLARDA HESAP YOK');
                } else {
                    embed.addField(capitalizeFirstLetter(servis), `${hesaplar.length} Hesap stoklarda`);
                }
            } else {
                embed.addField(capitalizeFirstLetter(servis), 'Stok bulunmamaktadır');
            }
        });

        message.channel.send({ embeds: [embed] });
    },
};

// İlk harfi büyük harfe dönüştüren yardımcı fonksiyon
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
