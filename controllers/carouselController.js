const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Carousel = require('../models/carouselModel');

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../carousel');
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
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    },
});

// API to add a new carousel slide
const addCarouselSlide = async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'At least one image is required' });
        }

        const newImages = files.map((file) => `/carousel/${file.filename}`);

        // Find existing carousel document
        let carousel = await Carousel.findOne();

        if (!carousel) {
            // If no document exists, create a new one
            carousel = new Carousel({ images: newImages });
        } else {
            // Append new images to existing document
            carousel.images.push(...newImages);
        }

        await carousel.save();

        res.status(201).json({ message: "Carousel updated successfully", carousel });
    } catch (error) {
        console.error("Error updating carousel:", error);
        res.status(500).json({ error: error.message });
    }
};

// API to get all carousel slides
const getCarouselSlides = async (req, res) => {
    try {
        const carousel = await Carousel.findOne(); // Fetch only one document
        if (!carousel) {
            return res.status(200).json({ success: true, slides: [] });
        }
        res.status(200).json({ success: true, slides: carousel.images, id: carousel._id }); // Return only images
    } catch (error) {
        console.error("Error fetching carousel slides:", error);
        res.status(500).json({ success: false, error: "Error fetching carousel slides" });
    }
};

// API to delete a carousel slide
const deleteCarouselSlide = async (req, res) => {
    try {
        const { id } = req.params; // Carousel ID
        const { removedImages } = req.body; // Images to delete (array of image paths)

        if (!removedImages || removedImages.length === 0) {
            return res.status(400).json({ error: 'No images specified for deletion' });
        }

        const slide = await Carousel.findById(id);
        if (!slide) {
            return res.status(404).json({ error: 'Carousel slide not found' });
        }

        // Filter out images that need to be deleted
        const updatedImages = slide.images.filter(image => !removedImages.includes(image));

        // Delete images from the filesystem
        removedImages.forEach(imagePath => {
            const filePath = path.join(__dirname, '../', imagePath);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        if (updatedImages.length === 0) {
            // If no images remain, delete the entire carousel entry
            await slide.deleteOne();
            return res.status(200).json({ message: 'Carousel slide deleted successfully' });
        } else {
            // Update the document with remaining images
            slide.images = updatedImages;
            await slide.save();
            return res.status(200).json({ message: 'Image(s) deleted successfully', updatedSlide: slide });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting carousel image(s)' });
    }
};
module.exports = {
    upload,
    addCarouselSlide,
    getCarouselSlides,
    deleteCarouselSlide,
    Carousel,
};
