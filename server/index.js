// FindIt API server: Express + MongoDB (Mongoose)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/items');
const Item = require('./models/Item');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/findit';

const app = express();

// middleware
app.use(cors());
app.use(express.json({ limit: '5mb' })); // photos are sent as resized data URLs

// routes
app.get('/api/health', (req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }));
app.get('/api/meta', (req, res) => res.json({ categories: Item.CATEGORIES, locations: Item.LOCATIONS }));
app.use('/api/items', itemRoutes);

// errors
app.use('/api', notFound);
app.use(errorHandler);

// connect to MongoDB first, then start listening
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected:', MONGO_URI);
    app.listen(PORT, () => console.log(`FindIt API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
