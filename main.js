// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

// MongoDB Setup
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Models
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Ensure unique usernames
    password: { type: String, required: true },
    role: { type: String, enum: ['Author', 'Borrower'], required: true }
});

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Author must be present
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    library: { type: mongoose.Schema.Types.ObjectId, ref: 'Library', required: true }, // Library must be present
    coverImage: { type: String } // Reference to Firebase image URL
});

const librarySchema = new mongoose.Schema({
    name: { type: String, required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);
const Library = mongoose.model('Library', librarySchema);

// Auth Middleware
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach verified user info to request
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid Token' });
    }
};

// Register User
app.post('/api/users/register', async (req, res) => {
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });

    try {
        await user.save();
        res.json({ message: 'User registered successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error registering user', error: err.message });
    }
});

// Login User
app.post('/api/users/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
    res.json({ token });
});

// Borrow a Book
app.post('/api/borrow', auth, async (req, res) => {
    const { bookId } = req.body;

    if (!bookId) return res.status(400).json({ message: 'Book ID is required' });

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.borrower) return res.status(400).json({ message: 'Book is already borrowed' });

    book.borrower = req.user._id;
    await book.save();
    res.json({ message: 'Book borrowed successfully' });
});

// Return a Book
app.put('/api/return/:id', auth, async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (!book.borrower || book.borrower.toString() !== req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot return this book' });
    }

    book.borrower = null;
    await book.save();
    res.json({ message: 'Book returned successfully' });
});

// Get All Libraries
app.get('/api/libraries', auth, async (req, res) => {
    const libraries = await Library.find().populate('books');
    res.json(libraries);
});

// Get Specific Library with Books
app.get('/api/libraries/:id', auth, async (req, res) => {
    const library = await Library.findById(req.params.id).populate('books');
    if (!library) return res.status(404).json({ message: 'Library not found' });
    res.json(library);
});

// Add a Book to Library Inventory
app.post('/api/libraries/:id/inventory', auth, async (req, res) => {
    const { bookId } = req.body;

    if (!bookId) return res.status(400).json({ message: 'Book ID is required' });

    const library = await Library.findById(req.params.id);
    if (!library) return res.status(404).json({ message: 'Library not found' });

    library.books.push(bookId);
    await library.save();
    res.json({ message: 'Book added to library inventory' });
});

// Remove Book from Library Inventory
app.delete('/api/libraries/:id/inventory/:bookId', auth, async (req, res) => {
    const library = await Library.findById(req.params.id);
    if (!library) return res.status(404).json({ message: 'Library not found' });

    library.books.pull(req.params.bookId);
    await library.save();
    res.json({ message: 'Book removed from library inventory' });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
