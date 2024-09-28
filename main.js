const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const libraryRoutes = require('./routes/libraryRoutes');

const app = express();

// Middleware for the jsaon parsing
app.use(express.json());

// Connect to Database
connectDB();

// Routes
app.use('/api/users', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/libraries', libraryRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
