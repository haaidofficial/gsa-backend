// const express = require('express');
// const router = express.Router();
// const { upload, createProduct, getProducts } = require('../controllers/productController');

// // Route to upload a product
// router.post('/create', upload.single('image'), createProduct);

// // Route to get all products
// router.get('/', getProducts);

// module.exports = router;





const express = require('express');
const router = express.Router();
const { upload, createProduct, getProducts, deleteProduct, getProductById, updateProduct, getProductByPageUrl, getProductsNavigation } = require('../controllers/productController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to upload products (single or multiple images)
router.post('/add-product', authMiddleware, upload.array('images', 10), createProduct); // Accept up to 10 images
router.post('/delete-product', deleteProduct)
router.get('/', getProducts);
// Route to get a product by ID
router.get('/get-product/:id', getProductById); // To fetch product details for editing

// Route to update a product by ID
router.put('/update-product/:id', upload.array('images', 10), updateProduct); // Handles updating the product with optional image uploads

router.get('/page/:pageUrl', getProductByPageUrl);

router.get('/navigation', getProductsNavigation);

// Route to get all products
// router.get('/', getProducts);

module.exports = router;

