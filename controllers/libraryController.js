const Library = require('../models/library');

// Get All Libraries
const getAllLibraries = async (req, res) => {
    try {
      const libraries = await Library.find().populate('books');
      res.json(libraries);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching libraries', error: error.message });
    }
  };
  
  // Get Specific Library by Title
  const getLibraryByTitle = async (req, res) => {
    const { title } = req.params; // Get title from request parameters
    try {
      const library = await Library.findOne({ name: title }).populate('books'); // Find by name
      if (!library) return res.status(404).json({ message: 'Library not found' });
      res.json(library);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching library', error: error.message });
    }
  };
  
  // Add Book to Library
  const addBookToLibrary = async (req, res) => {
    const { title } = req.body; // Use title instead of bookId
    const library = await Library.findOne({ name: req.params.id }); // Find library by name instead of ID
  
    if (!library) return res.status(404).json({ message: 'Library not found' });
  
    // Check if the book is already in the library
    if (!library.books.includes(title)) {
      library.books.push(title); // Push the book title instead of ID
    }
  
    await library.save();
    res.json({ message: 'Book added to library inventory' });
  };
  
  // Remove Book from Library
  const removeBookFromLibrary = async (req, res) => {
    const { title } = req.params; // Get title from request parameters
    const library = await Library.findOne({ name: req.params.id }); // Find library by name instead of ID
  
    if (!library) return res.status(404).json({ message: 'Library not found' });
  
    library.books.pull(title); // Use title to remove from the array
    await library.save(); // Save the updated library
    res.json({ message: 'Book removed from library inventory' });
  };
  
  // Create a new library
  const createLibrary = async (req, res) => {
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'Library name is required' });
    }
  
    try {
      const newLibrary = new Library({ name });
      await newLibrary.save();
      res.status(201).json({ message: 'Library created successfully', library: newLibrary });
    } catch (error) {
      res.status(500).json({ message: 'Error creating library', error: error.message });
    }
  };
  
  // Update details of a specific library by its Title
  const updateLibrary = async (req, res) => {
    const { title } = req.params;
    const { name } = req.body;
  
    if (!name) {
      return res.status(400).json({ message: 'Library name is required' });
    }
  
    try {
      const updatedLibrary = await Library.findOneAndUpdate({ name: title }, { name }, { new: true });
  
      if (!updatedLibrary) {
        return res.status(404).json({ message: 'Library not found' });
      }
  
      res.json({ message: 'Library updated successfully', library: updatedLibrary });
    } catch (error) {
      res.status(500).json({ message: 'Error updating library', error: error.message });
    }
  };
  
  // Delete a library by its Title
  const deleteLibrary = async (req, res) => {
    const { title } = req.params;
  
    try {
      const deletedLibrary = await Library.findOneAndDelete({ name: title });
  
      if (!deletedLibrary) {
        return res.status(404).json({ message: 'Library not found' });
      }
  
      res.json({ message: 'Library deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting library', error: error.message });
    }
  };
  
  // Retrieve a list of books available in a specific library by Title
  const getLibraryInventory = async (req, res) => {
    const { title } = req.params; // Get title from request parameters
  
    try {
      const library = await Library.findOne({ name: title }).populate('books');
  
      if (!library) {
        return res.status(404).json({ message: 'Library not found' });
      }
  
      res.json(library.books);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving library inventory', error: error.message });
    }
  };
  
  module.exports = {
    getAllLibraries,
    getLibraryByTitle,
    addBookToLibrary,
    removeBookFromLibrary,
    createLibrary,
    updateLibrary,
    deleteLibrary,
    getLibraryInventory
  };
  