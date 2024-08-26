const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortenedUrl: { type: String, required: true },
    lastShortenerIndex: { type: Number, default: 0 },
    accessCount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Link', linkSchema);
