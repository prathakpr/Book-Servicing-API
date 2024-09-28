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

  //Create a new library

  const createLibrary = async (req, res) => {
    const { name } = req.body;

    // Validate input
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

//Update details of a specific library by its ID
const updateLibrary = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    // Validate input
    if (!name) {
        return res.status(400).json({ message: 'Library name is required' });
    }

    try {
        const updatedLibrary = await Library.findByIdAndUpdate(id, { name }, { new: true });

        if (!updatedLibrary) {
            return res.status(404).json({ message: 'Library not found' });
        }

        res.json({ message: 'Library updated successfully', library: updatedLibrary });
    } catch (error) {
        res.status(500).json({ message: 'Error updating library', error: error.message });
    }
};

//Delete a library by its ID
const deleteLibrary = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedLibrary = await Library.findByIdAndDelete(id);

        if (!deletedLibrary) {
            return res.status(404).json({ message: 'Library not found' });
        }

        res.json({ message: 'Library deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting library', error: error.message });
    }
};

//Retrieve a list of books available in a specific library
const getLibraryInventory = async (req, res) => {
    const { id } = req.params;

    try {
        const library = await Library.findById(id).populate('books');

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
  getLibraryById,
  addBookToLibrary,
  removeBookFromLibrary,
  createLibrary,
  updateLibrary
};
