const { validationResult } = require("express-validator");
const Enquiry = require("../models/productEnquiryModel");
const Product = require("../models/productModel");


exports.submitEnquiry = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { productId, name, email, contactNo, message } = req.body;

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Create the enquiry
        const enquiry = await Enquiry.create({
            productId,
            name,
            email,
            contactNo,
            message,
        });

        res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.submitNormalEnquiry = async (req, res) => {
    try {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, contactNo, message } = req.body;

        // Create the enquiry
        const enquiry = await Enquiry.create({
            name,
            email,
            contactNo,
            message,
        });

        res.status(201).json({ message: 'Enquiry submitted successfully', enquiry });
    } catch (error) {
        console.error('Error submitting enquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getAllEnquiries = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        // Ensure page and limit are integers
        const pageNumber = parseInt(page, 10);
        const limitNumber = parseInt(limit, 10);

        // Pagination logic: skip and limit
        const enquiries = await Enquiry.find()
            .populate('productId', 'title pageUrl') // Include product details
            .sort({ createdAt: -1 }) // Sort by most recent first
            .skip((pageNumber - 1) * limitNumber) // Skip the documents for previous pages
            .limit(limitNumber); // Limit the number of documents

        // Get the total count for pagination metadata
        const totalEnquiries = await Enquiry.countDocuments();

        res.status(200).json({
            enquiries,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalEnquiries / limitNumber),
            totalEnquiries,
        });
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteEnquiry = async (req, res) => {
    try {
        const { enquiryId } = req.params; // Get the enquiryId from the URL parameters

        // Find and delete the enquiry by ID
        const enquiry = await Enquiry.findById(enquiryId);
        if (!enquiry) {
            return res.status(404).json({ error: 'Enquiry not found' });
        }

        // Delete the enquiry
        await Enquiry.deleteOne({ _id: enquiryId });

        res.status(200).json({ message: 'Enquiry deleted successfully' });
    } catch (error) {
        console.error('Error deleting enquiry:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};