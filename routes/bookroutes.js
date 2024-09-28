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

module.exports = booksRouter;