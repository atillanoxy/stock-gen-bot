const { readdirSync } = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const { token, prefix, owner_id } = require('./ayarlar.json');

// Komutları yükleme
client.commands = new Collection();
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Komut çalıştırma
client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('Komutu çalıştırırken bir hata oluştu.');
    }
});

// Botun hazır olduğunda mesaj gönderme
client.once('ready', () => {
    console.log('Bot hazır.');
    // Botun oynuyor etkinliğini ayarlama
    client.user.setActivity("Develop By Quillone 🔥 Dünyanın en tatlı üyelerini izliyor", { type: 'WATCHING' });
});

// VIP rolünü kontrol et ve kaldır
async function checkAndRemoveVIPRole(member) {
    const userVIPCode = await VIPCode.findOne({ _id: member.id });
    if (!userVIPCode || userVIPCode.skt < new Date()) {
        // VIP rolü süresi dolmuşsa kaldır
        const role = member.guild.roles.cache.get(roles.vip_role_id);
        if (role) {
            member.roles.remove(role);
            console.log(`${member.user.tag}'nin VIP rolü süresi doldu ve rolü kaldırıldı.`);

            // Aboneliğin sona erdiğini belirten mesajı oluştur
            const expirationMessage = new Discord.MessageEmbed()
                .setColor('#ff0000')
                .setTitle('Aboneliğiniz Sona Erdi')
                .setDescription(`Sayın ${member.user.username}, VIP aboneliğinizin süresi dolmuştur.`)
                .addField('Yeniden Abone Ol', 'Yeniden abone olmak için [buraya](www.example.com) tıklayın.');

            // Kullanıcıya mesajı gönder
            try {
                await member.send({ embeds: [expirationMessage] });
            } catch (error) {
                console.error(`Abonelik sona erdi ancak ${member.user.tag}'a mesaj gönderilemedi:`, error);
            }
        }
    }
}

// Botu başlatma
client.login(token);
