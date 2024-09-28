const Book = require('../models/book');

// Borrow a Book
const borrowBook = async (req, res) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (book.borrower) return res.status(400).json({ message: 'Book is already borrowed' });

  book.borrower = req.user._id;
  await book.save();
  res.json({ message: 'Book borrowed successfully' });
};

// Return a Book
const returnBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  if (!book.borrower || book.borrower.toString() !== req.user._id.toString()) {
    return res.status(400).json({ message: 'You cannot return this book' });
  }

  book.borrower = null;
  await book.save();
  res.json({ message: 'Book returned successfully' });
};

module.exports = { borrowBook, returnBook };
