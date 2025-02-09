const express = require('express');
const { upload, addCarouselSlide, getCarouselSlides, deleteCarouselSlide } = require('../controllers/carouselController');
const authMiddleware = require('../middlewares/authMiddleware');
const carouselValidation = require('../utils/carouselValidators');
const router = express.Router();


// Route to upload products (single or multiple images)
router.post(
    '/add-carousel',
    authMiddleware,
    upload.array('images', 5),
    carouselValidation,
    addCarouselSlide
); // Accept up to 5 images


router.get(
    '/get-carousels',
    getCarouselSlides
);

router.delete(
    '/delete-carousel/:id',
    authMiddleware,
    deleteCarouselSlide
);

module.exports = router;