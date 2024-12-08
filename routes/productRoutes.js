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
const { productValidation, updateProductValidation, productIdValidation, validateProductIdParam, validatePageUrl } = require('../utils/validators');
const validationErrorHandler = require('../middlewares/validationErrorHandler');

// Route to upload products (single or multiple images)
router.post(
    '/add-product',
    authMiddleware,
    upload.array('images', 5),
    productValidation,
    validationErrorHandler,
    createProduct
); // Accept up to 5 images

router.post(
    '/delete-product',
    authMiddleware,
    productIdValidation,
    validationErrorHandler,
    deleteProduct
)
router.get('/', authMiddleware, getProducts);


// Route to get a product by ID
router.get(
    '/get-product/:id',
    authMiddleware,
    validateProductIdParam,
    validationErrorHandler,
    getProductById
); // To fetch product details for editing

// Route to update a product by ID
router.put(
    '/update-product/:id',
    authMiddleware,
    validateProductIdParam,
    upload.array('images', 10),
    updateProductValidation,
    validationErrorHandler,
    updateProduct
); // Handles updating the product with optional image uploads

router.get(
    '/page/:pageUrl',
    validatePageUrl,
    validationErrorHandler,
    getProductByPageUrl
);

router.get(
    '/navigation',
    getProductsNavigation
);

// Route to get all products
// router.get('/', getProducts);

module.exports = router;

