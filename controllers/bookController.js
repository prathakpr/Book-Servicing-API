const Book = require('../models/book');
const { uploadImage } = require('./firebase');

// GET /api/books – Retrieve a list of all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
};

// GET /api/books/:title – Retrieve details of a specific book by its title
exports.getBookByTitle = async (req, res) => {
    const { title } = req.params;

    try {
        const book = await Book.findOne({ title: title });
        
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
    const coverImage = req.file ? req.file.path : null; // Ensure this returns the correct path as a string

    if (!title || !author || !library) {
        return res.status(400).json({ message: 'Title, author, and library are required' });
    }

    try {
        const newBook = new Book({
            title,
            author,
            library,
            coverImage // Ensure this is a string path to the image
        });

        // Upload image to Firebase
        if (coverImage) {
            await uploadImage(coverImage, `covers/${req.file.filename}`); // Update the destination path as needed
        }

        await newBook.save();
        res.json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        console.error('Error creating book:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error creating book', error: error.message });
    }
};

// PUT /api/books/:title – Update details of a specific book by its title
exports.updateBook = async (req, res) => {
    const { title, author, borrower, library } = req.body;
    const coverImage = req.file ? req.file.filename : null;

    try {
        const book = await Book.findOne({ title: req.params.title }); // Find book by title
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.author = author || book.author;
        book.borrower = borrower || book.borrower;
        book.library = library || book.library;
        if (coverImage) book.coverImage = coverImage;

        await book.save();
        res.json({ message: 'Book updated successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Error updating book', error: error.message });
    }
};

// DELETE /api/books/:title – Delete a book by its title
// DELETE /api/books/:title – Delete a book by its title
exports.deleteBook = async (req, res) => {
    const { title } = req.params; // Get title from request parameters

    try {
        const result = await Book.deleteOne({ title }); // Delete the book by title
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error); // Log error for debugging
        res.status(500).json({ message: 'Error deleting book', error: error.message });
    }
};

// POST /api/books/borrow – Borrow a book by title
exports.borrowBook = async (req, res) => {
    const { title, borrower } = req.body; // Use title instead of bookId
    try {
        const book = await Book.findOne({ title }); // Find book by title
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.borrower = borrower;
        await book.save();
        res.json({ message: 'Book borrowed successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Error borrowing book', error: error.message });
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
