require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/authModel');

module.exports = async (req, res, next) => {
    // Get the token from the Authorization header (Bearer token)
    const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Your secret key from .env

        const user = await User.findById(decoded.id);  // Get user by ID from the token

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach the user to the request object for access in routes
        req.user = user;

        next();  // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
