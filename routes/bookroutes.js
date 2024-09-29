const express = require('express');
const {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook
} = require('../controllers/bookController');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// GET /api/books – Retrieve a list of all books
router.get('/', verifyToken, getAllBooks);

// GET /api/books/:id – Retrieve details of a specific book by its ID
router.get('/:id', verifyToken, getBookById);

// POST /api/books – Create a new book entry with cover image
router.post('/', verifyToken, upload.single('coverImage'), createBook);

// PUT /api/books/:id – Update details of a specific book by its ID
router.put('/:id', verifyToken, upload.single('coverImage'), updateBook);

// DELETE /api/books/:id – Delete a book by its ID
router.delete('/:id', verifyToken, deleteBook);

// POST /api/books/borrow – Borrow a book
router.post('/borrow', verifyToken, borrowBook);

// PUT /api/books/return/:id – Return a borrowed book
router.put('/return/:id', verifyToken, returnBook);

module.exports = router;
