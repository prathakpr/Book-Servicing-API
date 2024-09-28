const express = require('express');
const { borrowBook, returnBook } = require('./controllers/bookController');
const verifyToken = require('./middleware/authMiddleware'); //Adding verify token middleware to verify that only authenticate user can use the APIs

// GET /api/books – Retrieve a list of all books
router.get('/', verifyToken, async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books' });
    }
});

// GET /api/books/:id – Retrieve details of a specific book by its ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id)
            .populate('author')    // Populates author details
            .populate('borrower')  // Populates borrower details
            .populate('library');  // Populates library details
        
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details' });
    }
});

// POST /api/books – Create a new book entry
router.post('/', verifyToken, async (req, res) => {
    const { title, author, library, coverImage } = req.body;

    if (!title || !author || !library) {
        return res.status(400).json({ message: 'Title, author, and library are required' });
    }

    try {
        const newBook = new Book({
            title,
            author,
            library,
            coverImage
        });
        await newBook.save();
        res.json({ message: 'Book created successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Error creating book' });
    }
});

// PUT /api/books/:id – Update details of a specific book by its ID
router.put('/:id', verifyToken, async (req, res) => {
    const { title, author, borrower, library, coverImage } = req.body;

    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        book.title = title || book.title;
        book.author = author || book.author;
        book.borrower = borrower || book.borrower;
        book.library = library || book.library;
        book.coverImage = coverImage || book.coverImage;

        await book.save();
        res.json({ message: 'Book updated successfully', book });
    } catch (error) {
        res.status(500).json({ message: 'Error updating book' });
    }
});

// DELETE /api/books/:id – Delete a book by its ID
router.delete('/:id', verifyToken, async (req, res) => {
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
});


module.exports = booksRouter;