const express = require('express');
const router = express.Router();
const axios = require('axios');
const Link = require('../models/Link');
const Shortener = require('../models/Shortener');

// Shorten a new link
router.post('/shorten', async (req, res) => {
    const { originalUrl } = req.body;
    const shorteners = await Shortener.find();

    if (shorteners.length === 0) {
        return res.status(400).json({ error: 'No custom shorteners available' });
    }

    // Use the first shortener for the initial shortening
    const firstShortener = shorteners[0];
    try {
        const response = await axios.post(firstShortener.apiUrl, {
            url: originalUrl,
            key: firstShortener.apiKey
        });

        const shortenedUrl = response.data.shortenedUrl;

        const newLink = new Link({
            originalUrl,
            shortenedUrl,
            lastShortenerIndex: 0
        });

        await newLink.save();
        res.json({ shortenedUrl });
    } catch (error) {
        res.status(500).json({ error: 'Error shortening the link' });
    }
});

// Redirect to the original link
router.get('/:shortenedUrl', async (req, res) => {
    const { shortenedUrl } = req.params;
    const link = await Link.findOne({ shortenedUrl });

    if (!link) {
        return res.status(404).json({ error: 'Link not found' });
    }

    const shorteners = await Shortener.find();
    const nextIndex = (link.lastShortenerIndex + 1) % shorteners.length;
    const nextShortener = shorteners[nextIndex];

    try {
        const response = await axios.post(nextShortener.apiUrl, {
            url: link.originalUrl,
            key: nextShortener.apiKey
        });

        const nextShortenedUrl = response.data.shortenedUrl;

        // Update link with new shortened URL and increment the lastShortenerIndex
        link.shortenedUrl = nextShortenedUrl;
        link.lastShortenerIndex = nextIndex;
        link.accessCount += 1;
        await link.save();

        res.redirect(nextShortenedUrl);
    } catch (error) {
        res.status(500).json({ error: 'Error shortening the link' });
    }
});

module.exports = router;
