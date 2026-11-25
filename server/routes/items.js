// REST routes for lost & found items:  /api/items
const express = require('express');
const Item = require('../models/Item');
const { asyncHandler } = require('../middleware/errorHandler');

const router = express.Router();

// escape regex special characters so a search such as "c++" or "(" is treated as plain text
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// fields a client is allowed to set (status is changed only through PATCH /resolve)
const EDITABLE = ['type', 'title', 'description', 'category', 'location', 'date', 'contactName', 'contactEmail', 'contactPhone', 'image'];
const pick = (body) => Object.fromEntries(EDITABLE.filter((k) => body[k] !== undefined).map((k) => [k, body[k]]));

// GET /api/items?q=&type=&category=&location=&status=&sort=
router.get('/', asyncHandler(async (req, res) => {
  const { q, type, category, location, status = 'open', sort = 'newest' } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (location) filter.location = location;
  if (status !== 'all') filter.status = status;
  if (q && q.trim()) {
    const rx = { $regex: escapeRegex(q.trim()), $options: 'i' };
    filter.$or = [{ title: rx }, { description: rx }];
  }
  const order = sort === 'oldest' ? { date: 1 } : { date: -1, createdAt: -1 };
  const items = await Item.find(filter).sort(order);
  res.json(items);
}));

// GET /api/items/stats  -> numbers for the header and the category chips
router.get('/stats', asyncHandler(async (req, res) => {
  const [lost, found, resolved, byCategory] = await Promise.all([
    Item.countDocuments({ type: 'lost', status: 'open' }),
    Item.countDocuments({ type: 'found', status: 'open' }),
    Item.countDocuments({ status: 'resolved' }),
    Item.aggregate([{ $match: { status: 'open' } }, { $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
  ]);
  res.json({ lost, found, resolved, byCategory: byCategory.map((c) => ({ category: c._id, count: c.count })) });
}));

// GET /api/items/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
}));

// POST /api/items
router.post('/', asyncHandler(async (req, res) => {
  const item = await Item.create(pick(req.body));
  res.status(201).json(item);
}));

// PUT /api/items/:id
router.put('/:id', asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, pick(req.body), { new: true, runValidators: true });
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json(item);
}));

// PATCH /api/items/:id/resolve  -> toggles open <-> resolved (returned to owner)
router.patch('/:id/resolve', asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  item.status = item.status === 'open' ? 'resolved' : 'open';
  item.resolvedAt = item.status === 'resolved' ? new Date() : null;
  await item.save();
  res.json(item);
}));

// DELETE /api/items/:id
router.delete('/:id', asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found' });
  res.json({ message: 'Item deleted', id: item._id });
}));

module.exports = router;
