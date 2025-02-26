const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const client = new Client({ authStrategy: new LocalAuth() });

client.on('qr', qr => {
    console.log('Scan QR Code ini di WhatsApp Web:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Bot WhatsApp siap!');
});

client.on('message', async msg => {
    if (msg.body.toLowerCase() === 'halo') {
        msg.reply('Halo! Ada yang bisa saya bantu?');
    }
});

module.exports = client;
