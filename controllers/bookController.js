const Book = require('../models/book');
const { uploadImage } = require('../services/firebase');
// GET /api/books – Retrieve a list of all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
};

// GET /api/books/:id – Retrieve details of a specific book by its ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('author')
            .populate('borrower')
            .populate('library');
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details' });
    }
};

// POST /api/books – Create a new book entry
const { bucket } = require('./firebase'); // Import the Firebase bucket configuration
const path = require('path'); // Node.js path module for handling file paths

// POST /api/books – Create a new book entry
exports.createBook = async (req, res) => {
  const { title, author, library } = req.body;
  const coverImage = req.file; // Get the uploaded file

  if (!title || !author || !library) {
      return res.status(400).json({ message: 'Title, author, and library are required' });
  }

  try {
      // Upload image to Firebase Storage and get the public URL
      const publicUrl = await uploadImage(coverImage);

      const newBook = new Book({
          title,
          author,
          library,
          coverImage: publicUrl, // Save the public URL
      });

      await newBook.save();
      res.json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
      res.status(500).json({ message: 'Error creating book', error: error.message });
  }
};

// PUT /api/books/:id – Update details of a specific book by its ID
exports.updateBook = async (req, res) => {
    const { title, author, borrower, library } = req.body;
    const coverImage = req.file ? req.file.filename : null;

    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.borrower = borrower || book.borrower;
        book.library = library || book.library;
        if (coverImage) book.coverImage = coverImage;

        await book.save();
        res.json({ message: 'Book updated successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Error updating book' });
    }
};

// DELETE /api/books/:id – Delete a book by its ID
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await book.remove();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book' });
    }
};

// POST /api/books/borrow – Borrow a book
exports.borrowBook = async (req, res) => {
    const { bookId, borrower } = req.body;
    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.borrower = borrower;
        await book.save();
        res.json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Error borrowing book' });
    }
};

// PUT /api/books/return/:id – Return a borrowed book
exports.returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.borrower = null;
        await book.save();
        res.json({ message: 'Book returned successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Error returning book' });
    }
};
