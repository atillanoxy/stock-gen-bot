const mongoose = require('mongoose');
const fs = require('fs');

// Ayarlar.json dosyasından gerekli bilgileri alın
const { owner_id, mongo_url } = JSON.parse(fs.readFileSync('./ayarlar.json', 'utf8'));

// MongoDB'ye bağlan
mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB\'ye başarıyla bağlandı');
}).catch(err => {
    console.error('MongoDB bağlantı hatası:', err);
});

// MongoDB'de kullanılacak şema (schema) örneği
const vipCodeSchema = new mongoose.Schema({
    vipcode: {
        type: String,
        required: true,
        unique: true // VIP kodlarının benzersiz olmasını sağlar
    },
    createdate: {
        type: Date,
        default: Date.now // Belge oluşturulduğunda otomatik olarak tarih ekler
    },
    used: {
        type: Boolean,
        default: false // Kullanılmadığı zaman false, kullanıldığında true olacak
    },
    skt: {
        type: Date,
        default: null // Son Kullanma Tarihi, başlangıçta null olarak ayarlanır
    },
    type: {
        type: String,
        enum: ['haftalık', 'aylık'], // Sadece haftalık veya aylık olabilir
        required: true
    }
});

// MongoDB'de kullanılacak model
const VIPCode = mongoose.model('VIPCode', vipCodeSchema);

module.exports = {
    name: 'vipcreate',
    description: 'Belirli bir sayıda ve türde VIP kodları oluşturur ve sahibe DM üzerinden teslim eder.',
    usage: '<kaçtane> <haftalık/aylık>',
    async execute(message, args) {
        if (message.author.id !== owner_id) {
            return message.reply('Bu komutu kullanmaya yetkiniz yok.');
        }

        const count = parseInt(args[0]);
        const type = args[1].toLowerCase();

        if (isNaN(count) || (type !== 'haftalık' && type !== 'aylık')) {
            return message.reply('Geçersiz parametreler. Lütfen kaç tane olduğunu ve türünü belirtin. Örnek: !vipcreate <kaçtane> <haftalık/aylık>');
        }

        // VIP kodları oluştur
        const VIPCodes = generateVIPCodes(count, type);

        // VIP kodlarını MongoDB'ye kaydet
        try {
            await VIPCode.insertMany(VIPCodes);
            const replyMessage = `Başarıyla ${count} adet ${type} VIP kodu oluşturuldu ve MongoDB'ye kaydedildi.`;
            message.reply(replyMessage);
            // Komutu kullanan kişiye DM yoluyla mesaj gönder
            sendDM(message.author, VIPCodes);
        } catch (err) {
            console.error('VIP kodları MongoDB\'ye kaydedilirken bir hata oluştu:', err);
            message.reply('VIP kodları oluşturulurken bir hata oluştu.');
        }
    }
};

// VIP kodları oluştur
function generateVIPCodes(count, type) {
    const VIPCodes = [];
    for (let i = 0; i < count; i++) {
        const code = generateCode();
        VIPCodes.push({ vipcode: code, type });
    }
    return VIPCodes;
}

// 15 haneli rastgele kod oluştur
function generateCode() {
    const length = 15;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
}

// Kullanıcıya DM yoluyla VIP kodlarını gönder
function sendDM(user, VIPCodes) {
    let message = 'İşte size oluşturulan VIP kodları:\n';
    VIPCodes.forEach(code => {
        message += `${code.vipcode} - ${code.type}\n`;
    });

    // VIP kodlarını bir metin dosyasına yaz
    const filePath = `VIPCodes_${Date.now()}.txt`; // Dosya adında zaman damgası kullanarak benzersiz bir dosya adı oluştur
    fs.writeFile(filePath, message, (err) => {
        if (err) {
            console.error('VIP kodları dosyaya yazılırken bir hata oluştu:', err);
            return;
        }
        console.log('VIP kodları başarıyla dosyaya yazıldı:', filePath);

        // Dosyayı kullanıcıya DM olarak gönder
        user.send({
            files: [filePath]
        }).then(() => {
            // Dosyayı sildikten sonra
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Dosya silinirken bir hata oluştu:', err);
                    return;
                }
                console.log('Dosya başarıyla silindi:', filePath);
            });
        }).catch(error => {
            console.error('Dosya gönderilirken bir hata oluştu:', error);
        });
    });
}