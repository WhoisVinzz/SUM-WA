/**
 * WhatsApp Bot API
 * 
 * API ini memungkinkan pengguna untuk mengirim pesan teks dan media ke WhatsApp
 * menggunakan bot yang dikendalikan melalui REST API.
 * 
 * Endpoints:
 * 
 * 1. GET /send-message
 *    - Mengirim pesan teks ke nomor WhatsApp tertentu.
 *    - Query Params: ?number=6281234567890&message=Halo!
 * 
 * 2. GET /send-media
 *    - Mengirim file media (gambar, video, audio) ke nomor WhatsApp.
 *    - Query Params: ?number=6281234567890&fileUrl=https://example.com/image.jpg&caption=Ini+gambar!
 * 
 * 3. GET /chats
 *    - Mengambil daftar chat yang tersedia di akun WhatsApp bot.
 * 
 * Petunjuk Penggunaan:
 * 1. Install dependencies dengan perintah: npm install
 * 2. Jalankan bot dengan perintah: node index.js
 * 3. Scan QR Code yang muncul di terminal menggunakan WhatsApp Web.
 * 4. Setelah bot terhubung, gunakan endpoint yang tersedia untuk mengirim pesan.
 * 
 * Teknologi yang digunakan:
 * - Node.js dengan framework Express
 * - whatsapp-web.js untuk integrasi dengan WhatsApp
 * - Axios untuk mengambil file media dari URL sebelum dikirim
 */

const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { MessageMedia } = require('whatsapp-web.js');
const app = express();
const port = 3000;
const client = require('./whatsappClient');
const { logMessage } = require('./utils/logger');
const { sendMessage } = require('./services/messageService');

// API Endpoint untuk mengirim pesan teks
app.get('/send-message', async (req, res) => {
    const { number, message } = req.query;
    if (!number || !message) {
        return res.status(400).json({ status: 'error', message: 'Nomor dan pesan harus diisi' });
    }
    try {
        const numberId = await client.getNumberId(number);
        if (!numberId) {
            return res.status(400).json({ status: 'error', message: 'Nomor tidak valid atau tidak terdaftar di WhatsApp' });
        }
        let response = await sendMessage(numberId._serialized, message);
        res.json({ status: 'success', response });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// API Endpoint untuk mengirim media
app.get('/send-media', async (req, res) => {
    const { number, fileUrl, caption } = req.query;
    if (!number || !fileUrl) {
        return res.status(400).json({ status: 'error', message: 'Nomor dan fileUrl harus diisi' });
    }
    try {
        const numberId = await client.getNumberId(number);
        if (!numberId) {
            return res.status(400).json({ status: 'error', message: 'Nomor tidak valid atau tidak terdaftar di WhatsApp' });
        }
        // Download file dari URL dan konversi ke base64
        const response = await axios({
            url: fileUrl,
            responseType: 'arraybuffer'
        });
        const media = new MessageMedia(
            response.headers['content-type'], 
            response.data.toString('base64'), 
            path.basename(fileUrl)
        );

        // Kirim media ke WhatsApp
        let sendResponse = await client.sendMessage(numberId._serialized, media, { caption });
        
        res.json({ status: 'success', response: sendResponse });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// API Endpoint untuk mendapatkan daftar chat terbaru
app.get('/chats', async (req, res) => {
    try {
        let chats = await client.getChats();
        res.json({ status: 'success', chats });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
});

// Menjalankan server
app.listen(port, () => {
    console.log(`API berjalan di http://localhost:${port}`);
});

// Menjalankan bot
client.initialize();
