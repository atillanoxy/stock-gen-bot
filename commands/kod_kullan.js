const Discord = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');

// Ayarlar.json dosyasından gerekli bilgileri alın
const { roles, mongo_url } = JSON.parse(fs.readFileSync('./ayarlar.json', 'utf8'));
const { vip_role_id } = roles;

// MongoDB'ye bağlan
mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'vipcodes' // Veritabanı adını belirtin
}).then(() => {
    console.log('MongoDB\'ye başarıyla bağlandı');
}).catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
});

// MongoDB'de kullanılacak model
const VIPCode = mongoose.model('vipcodes', new mongoose.Schema({
    vipcode: String,
    used: Boolean,
    skt: Date,
    type: String,
    createdate: Date
}), 'vipcodes');

module.exports = {
    name: 'kodkullan',
    description: 'Belirli bir VIP kodunu kullanarak VIP rolünü alır.',
    usage: '<kod>',
    async execute(message, args) {
        if (args.length !== 1) {
            return message.reply('Lütfen kullanmak istediğiniz VIP kodunu belirtin.');
        }

        const code = args[0];

        try {
            const vipCode = await VIPCode.findOne({ vipcode: code });

            if (!vipCode) {
                return message.reply('Geçersiz VIP kodu.');
            }

            if (vipCode.used) {
                return message.reply('Bu VIP kodu zaten kullanılmış.');
            }

            // VIP kodunun türüne göre rol ver
            const role = message.guild.roles.cache.get(vip_role_id);
            if (!role) {
                return message.reply('VIP rolü bulunamadı. Lütfen ayarlarınızı kontrol edin.');
            }

            // Kullanıcıya VIP rolünü ver
            const member = message.member;
            await member.roles.add(role);

            // Kullanılan VIP kodunu işaretle
            vipCode.used = true;
            vipCode.skt = calculateExpirationDate(vipCode.type);
            await vipCode.save();

            // Embed oluştur
            const embed = new Discord.MessageEmbed()
                .setTitle('VIP Aboneliğiniz Başlatıldı')
                .setDescription(`**Abonelik Türü:** ${vipCode.type}\n**Son Kullanma Tarihi:** ${vipCode.skt}\nTeşekkürler! VIP Aboneliğiniz başarıyla başlatıldı.`)
                .setColor('#0099ff')
                .setThumbnail('https://example.com/sunucu_ppsi.png');

            message.reply({ embeds: [embed] });

        } catch (err) {
            console.error('VIP kodu kullanılırken bir hata oluştu:', err);
            message.reply('VIP kodu kullanılırken bir hata oluştu.');
        }
    }
};

// VIP kodunun türüne göre son kullanma tarihini hesapla
function calculateExpirationDate(type) {
    const skt = new Date();
    if (type === 'haftalık') {
        skt.setDate(skt.getDate() + 7);
    } else if (type === 'aylık') {
        skt.setDate(skt.getDate() + 31);
    }
    return skt;
}
