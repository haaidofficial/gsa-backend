const { body, param } = require('express-validator');
const mongoose = require('mongoose');

const validateEnquiry = [
    body('productId')
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Product ID');
            }
            return true;
        })
        .withMessage('Product ID must be a valid MongoDB ObjectId'),
    body('name')
        .trim()
        .escape()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

    body('contactNo')
        .trim()
        .escape()
        .matches(/^[0-9]{10}$/).withMessage('Contact number must be 10 digits'),

    body('message')
        .trim()
        .escape()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
];

const validateContactForm = [
    body('name')
        .trim()
        .escape()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email address'),

    body('contactNo')
        .trim()
        .escape()
        .matches(/^[0-9]{10}$/).withMessage('Contact number must be 10 digits'),

    body('message')
        .trim()
        .escape()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),

    body('referrer')
        .isString().withMessage('Referrer must be a string')
        .escape().withMessage('Referrer contains invalid characters'),
];

const validateUpdateAccount = [
    // Validate and sanitize inputs
    body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    body('email').optional().isEmail().withMessage('Invalid email format'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
]

const validateLogin = [
    body('email')
        .isEmail().withMessage('Email must be valid')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character')
        .trim(), // Removes leading/trailing whitespaces
];

const validateSignUp = [
    body('name')
        .trim()
        .escape()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

    body('email')
        .isEmail().withMessage('Email must be valid')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8, max: 16 }).withMessage('Password must be between 8 and 16 characters long')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/\d/).withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&]/).withMessage('Password must contain at least one special character')
        .trim(), // Removes leading/trailing whitespaces
];

const productValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long')
        .escape(), // Escape HTML characters

    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long'),

    // Custom validation for file uploads
    body().custom((value, { req }) => {
        // Ensure files are uploaded
        if (!req.files || req.files.length === 0) {
            throw new Error('At least one image is required');
        }

        // Validate file types (ensure only images are uploaded, including WebP)
        const validImageTypes = ['image/jpeg', 'image/png', 'image/webp']; // Handles jpg, jpeg, png, webp
        for (let file of req.files) {
            if (!validImageTypes.includes(file.mimetype)) {
                throw new Error('Only image files (jpeg, png, webp) are allowed');
            }
        }

        return true;
    }),
];


const updateProductValidation = [
    // Validate and sanitize the product title
    body('title')
        .trim()
        .optional() // Make title optional for update
        .isLength({ min: 3 }).withMessage('Title must be at least 3 characters long')
        .escape(),

    // Validate and sanitize the description
    body('description')
        .trim()
        .optional() // Make description optional for update
        .isLength({ min: 10 }).withMessage('Description must be at least 10 characters long')   ,

    // Validate the removedImages field (must be a valid JSON array)
    body('removedImages')
        .optional()
        .custom((value) => {
            if (value) {
                try {
                    const removedImagesArray = JSON.parse(value);
                    if (!Array.isArray(removedImagesArray)) {
                        throw new Error('removedImages must be a JSON array');
                    }
                } catch (error) {
                    throw new Error('removedImages must be a valid JSON string');
                }
            }
            return true;
        }),

    // Validate file uploads (ensure only image files)
    body().custom((value, { req }) => {
        if (req.files && req.files.length > 0) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/webp']; // Only jpeg, png, webp
            for (let file of req.files) {
                if (!validImageTypes.includes(file.mimetype)) {
                    throw new Error('Only image files (jpeg, png, webp) are allowed');
                }
            }
        }
        return true;
    }),
];

const productIdValidation = [
    body('productId')
        .custom((value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                throw new Error('Invalid Product ID');
            }
            return true;
        })
        .withMessage('Product ID must be a valid MongoDB ObjectId'),
];

const validateProductIdParam = [
    param('id')
        .isMongoId().withMessage('Invalid product ID format'),  // Check if it's a valid MongoDB ObjectId
];


const validatePageUrl = param('pageUrl')
    .matches(/^[a-z0-9\-@.]+$/)  // Allow lowercase letters, numbers, hyphens, periods, and @
    .withMessage('Page URL can only contain lowercase letters, numbers, hyphens, periods, and @ symbols.')
    .isLength({ min: 3 })  // Ensure it's at least 3 characters long
    .withMessage('Page URL must be at least 3 characters long.')
    .trim()  // Remove leading and trailing spaces
    .escape();

module.exports = {
    validateEnquiry,
    validateContactForm,
    validateUpdateAccount,
    validateLogin,
    productValidation,
    updateProductValidation,
    productIdValidation,
    validateProductIdParam,
    validatePageUrl,
    validateSignUp
}
