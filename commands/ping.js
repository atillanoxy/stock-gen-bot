// commands/ping.js

module.exports = {
    name: 'ping',
    description: 'Botun ve API gecikmesini ölçer.',
    execute(message, args, client) {
        message.channel.send('Ping ölçülüyor...').then(sentMessage => {
            sentMessage.edit(`Bot gecikmesi: ${sentMessage.createdTimestamp - message.createdTimestamp}ms, API gecikmesi: ${client.ws.ping}ms`);
        }).catch(error => {
            console.error(error);
            message.reply('Ping ölçülürken bir hata oluştu!');
        });
    },
};
