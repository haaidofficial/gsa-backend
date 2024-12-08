const Product = require('../models/productModel');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const slugify = require('slugify');
const { validationResult } = require('express-validator');

const createSlug = (title) => {
  return slugify(title, {
    lower: true,      // Convert to lowercase
    strict: true,     // Remove special characters except dashes
    locale: 'en',     // Language locale
  });
};

const createUniqueSlug = async (title) => {
  let pageUrl = createSlug(title);
  let pageUrlExists = await Product.findOne({ pageUrl });

  if (pageUrlExists) {
    // Append a counter to the pageUrl if it already exists
    const uniqueSuffix = Date.now();
    pageUrl = `${createSlug(title)}-${uniqueSuffix}`;
  }

  return pageUrl;
};

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});


const createProduct = async (req, res) => {
  try {

    const files = req.files; // Handle multiple image uploads
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'At least one image is required' });
    }

    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required.' });
    }
    ``
    // Generate a unique pageUrl
    const pageUrl = await createUniqueSlug(title);

    const productData = {
      title,
      description,
      pageUrl,
      images: files.map((file) => `/uploads/${file.filename}`), // Relative file paths
    };

    // Save productData to the database
    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product,
      url: `${req.protocol}://${req.get('host')}/products/${product.pageUrl}`, // Return the product URL
    });
  } catch (error) {
    // Handle duplicate key error (e.g., unique pageUrl constraint)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.pageUrl) {
      return res.status(400).json({ error: 'pageUrl already exists. Please use a different title.' });
    }
    res.status(500).json({ error: error.message });
  }
};

const getProductByPageUrl = async (req, res) => {
  try {
    const pageUrl = req.params.pageUrl;
    const product = await Product.findOne({ pageUrl, isDeleted: false });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const deleteProduct = async (req, res) => {
//   const { productId } = req.body;
//   try {
//     const product = await Product.findByIdAndUpdate(
//       productId,
//       { isDeleted: true }, // Set isDeleted to true
//       { new: true } // Return the updated product
//     );

//     if (!product) {
//       return { message: 'Product not found' };
//     }
//     res.status(201).json({ message: 'Product deleted successfully', product });

//   } catch (error) {
//     console.error('Error deleting product:', error);
//     return { message: 'Error deleting product' };
//   }
// };


// ----
// const deleteProduct = async (req, res) => {
//   const { productId } = req.body;

//   try {
//     const product = await Product.findByIdAndDelete(productId); // Permanently delete the product

//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     res.status(200).json({ message: 'Product deleted successfully', product });
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     res.status(500).json({ message: 'Error deleting product', error: error.message });
//   }
// };

// ----
const deleteProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Remove images from the filesystem
    const deleteImages = async (images) => {
      for (const imagePath of images) {
        // const fullPath = path.join(__dirname, '..', imagePath); // Adjust relative path to your uploads folder
        const filePath = path.join(__dirname, '../', imagePath);
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error(`Error deleting image file (${imagePath}):`, err);
        }
      }
    };

    await deleteImages(product.images);

    // Permanently delete the product from the database
    await product.deleteOne();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};



const getProducts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    // Filter products that are not deleted
    const totalProducts = await Product.countDocuments({ isDeleted: false });
    const products = await Product.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({ products, total: totalProducts });
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

const getProductsNavigation = async (req, res) => {
  try {
    // Retrieve pagination details if provided
    const skip = parseInt(req.query.skip) || 0; // Default to 0 if skip is not provided
    const limit = parseInt(req.query.limit) || 10; // Default limit to 10 if not provided

    // Get total number of products that are not deleted
    const totalProducts = await Product.countDocuments({ isDeleted: false });

    // Fetch products with required fields, sorted by creation date (recent first)
    const products = await Product.find({ isDeleted: false })
      .sort({ createdAt: -1 }) // Sort by most recent first
      .skip(skip)
      .limit(limit)
      .select('title pageUrl'); // Select only title and pageUrl fields

    res.status(200).json({ products, total: totalProducts });
  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ error: "Error fetching products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
};

// const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, description } = req.body;

//     const product = await Product.findById(id);

//     if (!product) {
//       return res.status(404).json({ error: 'Product not found' });
//     }

//     // Update fields
//     product.title = title || product.title;
//     product.description = description || product.description;

//     // Handle images
//     if (req.files && req.files.length > 0) {
//       // Delete old images if needed
//       product.images.forEach((imagePath) => {
//         const filePath = path.join(__dirname, '..', 'uploads', imagePath);
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath); // Delete the file
//         }
//       });

//       // Save new images
//       product.images = req.files.map((file) => file.filename);
//     }

//     await product.save();

//     res.status(200).json({ message: 'Product updated successfully', product });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'An error occurred while updating the product' });
//   }
// };

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, removedImages } = req.body; // `removedImages` is a JSON string

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Update fields
    product.title = title || product.title;
    product.description = description || product.description;

    // Handle removed images
    let existingImages = product.images; // Existing images in the DB
    const removedImagesArray = removedImages ? JSON.parse(removedImages) : [];

    if (removedImagesArray.length > 0) {
      removedImagesArray.forEach((imagePath) => {
        const filePath = path.join(__dirname, '../', imagePath);

        // Remove image from server if it exists
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

        // Remove image from the existing images list
        existingImages = existingImages.filter((img) => img !== imagePath);
      });
    }

    // Handle new uploaded images
    const newUploadedImages = req.files.map((file) => `/uploads/${file.filename}`);

    // Merge existing images (after removals) with new ones
    product.images = [...existingImages, ...newUploadedImages];

    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the product' });
  }
};



module.exports = {
  upload,
  createProduct,
  getProducts,
  deleteProduct,
  getProductById,
  updateProduct,
  getProductByPageUrl,
  getProductsNavigation
};
