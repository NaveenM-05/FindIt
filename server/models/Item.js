// Mongoose model for a lost or found item.
const mongoose = require('mongoose');

const CATEGORIES = ['Electronics', 'ID Cards', 'Books & Notes', 'Bags', 'Keys', 'Clothing', 'Accessories', 'Other'];
const LOCATIONS = ['Library', 'Canteen', 'CSE Block', 'Main Block', 'Auditorium', 'Sports Ground', 'Parking', 'Hostel', 'Bus Stop', 'Other'];

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Please choose Lost or Found'],
      enum: { values: ['lost', 'found'], message: 'Type must be lost or found' },
    },
    title: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [3, 'Item name must be at least 3 characters'],
      maxlength: [80, 'Item name must be at most 80 characters'],
    },
    description: { type: String, trim: true, maxlength: [1000, 'Description must be at most 1000 characters'], default: '' },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: CATEGORIES, message: 'Unknown category: {VALUE}' },
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      enum: { values: LOCATIONS, message: 'Unknown location: {VALUE}' },
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      validate: {
        validator: (v) => v.getTime() <= Date.now() + 24 * 60 * 60 * 1000,
        message: 'Date cannot be in the future',
      },
    },
    contactName: { type: String, required: [true, 'Your name is required'], trim: true, maxlength: 60 },
    contactEmail: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
    },
    contactPhone: { type: String, trim: true, match: [/^(\d{10})?$/, 'Phone number must be 10 digits'], default: '' },
    image: { type: String, default: '' }, // resized photo stored as a data URL or an image link
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    resolvedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
module.exports.CATEGORIES = CATEGORIES;
module.exports.LOCATIONS = LOCATIONS;
