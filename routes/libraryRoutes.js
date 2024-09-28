const express = require('express');
const {
  getAllLibraries,
  getLibraryById,
  addBookToLibrary,
  removeBookFromLibrary
} = require('../controllers/libraryController');
const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, getAllLibraries);
router.get('/:id', verifyToken, getLibraryById);
router.post('/:id/inventory', verifyToken, addBookToLibrary);
router.delete('/:id/inventory/:bookId', verifyToken, removeBookFromLibrary);

module.exports = router;
