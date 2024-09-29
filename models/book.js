const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, ref: 'User', required: true },
  borrower: { type: String, ref: 'User' },
  library: { type: String, ref: 'Library', required: true },
  coverImage: { type: String }
});

module.exports = mongoose.model('Book', bookSchema);
