const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const linkRoutes = require('./routes/links');

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/link-shortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Routes
app.use('/api/links', linkRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
