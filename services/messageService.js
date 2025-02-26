const client = require('../whatsappClient');
const { MessageMedia } = require('whatsapp-web.js');

const sendMessage = async (number, message) => {
    const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
    let response = await client.sendMessage(formattedNumber, message);
    return response;
};

const sendMedia = async (number, filePath, caption = '') => {
    const formattedNumber = number.includes('@c.us') ? number : `${number}@c.us`;
    const media = MessageMedia.fromFilePath(filePath);
    let response = await client.sendMessage(formattedNumber, media, { caption });
    return response;
};

module.exports = { sendMessage, sendMedia };
