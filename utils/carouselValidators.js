const { body } = require('express-validator');

const carouselValidation = [
    // Custom validation for file uploads
    body().custom((value, { req }) => {
        // Ensure files are uploaded
        if (!req.files || req.files.length === 0) {
            throw new Error('At least one image is required');
        }

        // Validate file types (ensure only images are uploaded, including WebP)
        const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']; // Handles jpg, jpeg, png, webp
        for (let file of req.files) {
            if (!validImageTypes.includes(file.mimetype)) {
                throw new Error('Only image files (jpeg, png, webp, jpg) are allowed');
            }
        }

        return true;
    }),
];


module.exports = carouselValidation;