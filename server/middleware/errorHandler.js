// Central error handling for the Express app.

// Wraps an async route so a rejected promise goes to the error handler (needed in Express 4).
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// 404 for unknown API routes
function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Express recognises an error handler by its four arguments
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // invalid MongoDB ObjectId, e.g. /api/items/abc
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
  }
  // Mongoose schema validation failed -> list every message
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: errors.join('. '), errors });
  }
  // photo too large for express.json limit
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'Request is too large. Please choose a smaller photo.' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }
  console.error(err);
  res.status(err.status || 500).json({ message: err.status ? err.message : 'Something went wrong on the server' });
}

module.exports = { asyncHandler, notFound, errorHandler };
