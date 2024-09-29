const express = require('express');
const {
    getAllBooks,
    getBookByTitle,
    createBook,
    updateBook,
    deleteBook,
    borrowBook,
    returnBook
} = require('../controllers/bookController'); // Check the path
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', verifyToken, getAllBooks);
router.get('/:title', verifyToken, getBookByTitle);
router.post('/', verifyToken, upload.single('coverImage'), createBook);
router.put('/:title', verifyToken, upload.single('coverImage'), updateBook); // Ensure updateBook is defined
router.delete('/:title', verifyToken, deleteBook); // Ensure deleteBook is defined
router.post('/borrow', verifyToken, borrowBook);
router.put('/return/:title', verifyToken, returnBook);

module.exports = router;
