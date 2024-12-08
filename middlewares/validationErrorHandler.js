const { validationResult } = require('express-validator');

const validationErrorHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); // Return validation errors if any
    }
    next(); // Proceed to the next middleware/controller if no validation errors
};

module.exports = validationErrorHandler;
