const jwt = require('jsonwebtoken');

// Helper function to generate a JWT token
const generateToken = (payload, expiresIn = '30m') => {

    const secret = process.env.JWT_SECRET || 'pulkits secret';
    const options = { expiresIn }; // Token expiration time

    // Generate and return the token
    return jwt.sign(payload, secret, options);
};

module.exports = generateToken;
