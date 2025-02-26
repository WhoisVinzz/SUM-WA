const fs = require('fs');

const logMessage = (number, message) => {
    const logEntry = `${new Date().toISOString()} - To: ${number} - Message: ${message}\n`;
    fs.appendFileSync('message_logs.txt', logEntry);
};

module.exports = { logMessage };
