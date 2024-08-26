const mongoose = require('mongoose');

const shortenerSchema = new mongoose.Schema({
    apiUrl: { type: String, required: true },
    apiKey: { type: String, required: true },
});

module.exports = mongoose.model('Shortener', shortenerSchema);
