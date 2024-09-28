const Library = require('./models/Library');

// Get All Libraries
const getAllLibraries = async (req, res) => {
  const libraries = await Library.find().populate('books');
  res.json(libraries);
};

// Get Specific Library
const getLibraryById = async (req, res) => {
  const library = await Library.findById(req.params.id).populate('books');
  if (!library) return res.status(404).json({ message: 'Library not found' });
  res.json(library);
};

// Add Book to Library
const addBookToLibrary = async (req, res) => {
    const { bookId } = req.body;
    const library = await Library.findById(req.params.id);
    if (!library) return res.status(404).json({ message: 'Library not found' });
  
    library.books.push(bookId);
    await library.save();
    res.json({ message: 'Book added to library inventory' });
  };
  
  // Remove Book from Library
  const removeBookFromLibrary = async (req, res) => {
    const library = await Library.findById(req.params.id);
    if (!library) return res.status(404).json({ message: 'Library not found' });
  
    library.books.pull(req.params.bookId); //mongoose method to remove 
    await library.save(); // after remove saving the db
    res.json({ message: 'Book removed from library inventory' });
  };
  

module.exports = {
  getAllLibraries,
  getLibraryById,
  addBookToLibrary,
  removeBookFromLibrary
};
