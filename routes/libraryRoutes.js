const express = require('express');
const {
  getAllLibraries,
  getLibraryByTitle, // This needs to be modified to fetch by title, not ID
  addBookToLibrary,
  removeBookFromLibrary,
  createLibrary,
  updateLibrary,
  deleteLibrary,
  getLibraryInventory
} = require('../controllers/libraryController');

const verifyToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get all libraries
router.get('/', verifyToken, getAllLibraries);

// Get library by title (using title instead of ID)
router.get('/:title', verifyToken, getLibraryByTitle);

// Add a book to the library's inventory (still assuming you want to use ID)
router.post('/:id/inventory', verifyToken, addBookToLibrary);

// Remove a book from the library's inventory using title
router.delete('/:id/inventory/:title', verifyToken, removeBookFromLibrary);

// Create a new library
router.post('/', verifyToken, createLibrary);

// Update library details using title instead of ID
router.put('/:title', verifyToken, updateLibrary);

// Delete library using title instead of ID
router.delete('/:title', verifyToken, deleteLibrary);

// Get library inventory using title instead of ID
router.get('/:title/inventory', verifyToken, getLibraryInventory);

module.exports = router;
