const fs = require('fs');
const path = require('path');
const { MessageEmbed } = require('discord.js');

// Ayarlar yükleniyor
const ayarlar = require('../ayarlar.json');

// Abonelikler, roller ve kanallar
const abonelikler = ['free', 'boost', 'vip'];
const servisler = ['steam', 'valorant', 'disney', 'blutv', 'netflix', 'exxen', 'xbox'];
const roller = ayarlar.roles;
const kanallar = ayarlar.channels;

module.exports = {
    name: 'gen',
    description: 'Belirli abonelikten belirli servisten hesap alır ve kullanıcıya verir.',
    execute(message, args) {
        if (args.length !== 2) {
            return message.reply(`Lütfen doğru parametrelerle komutu kullanın: ${ayarlar.prefix}gen <abonelik> <servis>`);
        }

        const abonelik = args[0].toLowerCase();
        const servis = args[1].toLowerCase();

        if (!abonelikler.includes(abonelik) || !servisler.includes(servis)) {
            return message.reply('Geçersiz abonelik veya servis tipi.');
        }

        // Kullanıcının sahip olduğu rolleri al
        const kullaniciRolleri = message.member.roles.cache;

        // Kullanıcının belirli bir abonelik rolüne sahip olup olmadığını kontrol et
        if (!kullaniciRolleri.some(rol => rol.id === roller[`${abonelik}_role_id`])) {
            return message.reply(`Bu komutu kullanmak için gerekli aboneliğe sahip değilsin`);
        }

        // Kullanıcının belirli bir abonelik kanalında olduğunu kontrol et
        if (message.channel.id !== kanallar[`${abonelik}_chat_id`]) {
            return message.reply(`Bu komutu sadece <#${ayarlar.channels[`${abonelik}_chat_id`]}> kanalında kullanabilirsiniz.`);
        }

        const projeDizini = path.resolve(__dirname, '..'); // Komut dosyasının bulunduğu dizinden bir üst dizine git
        const dosyaYolu = path.join(projeDizini, 'stok', abonelik, `${servis}.txt`);

        console.log("Dosya Yolu:", dosyaYolu); // Dosya yolunu kontrol etmek için log ekle

        fs.readFile(dosyaYolu, 'utf8', (err, data) => {
            if (err) {
                return message.reply('Stok bulunamadı veya bir hata oluştu.');
            }

            const hesaplar = data.trim().split('\n');

            if (hesaplar.length === 0) {
                return message.reply('Stok bulunamadı.');
            }

            const verilecekHesap = hesaplar.shift();
            const yeniVeri = hesaplar.join('\n');

            fs.writeFile(dosyaYolu, yeniVeri, (err) => {
                if (err) {
                    return message.reply('Hesap verilirken bir hata oluştu.');
                }

                // Kullanıcıya embed mesajı gönderme
                const embed = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('GELTA ACC SERVİCE')
                    .setDescription('Hesap bilgileri:')
                    .addField('Kullanıcı Adı', message.author.username)
                    .addField('Hesap', verilecekHesap);

                // Mesajı sadece DM olarak gönderme
                message.author.send({ embeds: [embed] })
                    .then(() => message.reply('DM kutunuza hesap gönderildi.'))
                    .catch(error => console.error('DM gönderilirken hata oluştu:', error));
            });
        });
    },
};
