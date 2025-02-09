const mongoose = require("mongoose");

const carouselSchema = new mongoose.Schema({
    images: { type: [String], default: [] }, // Store multiple images in one document
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Carousel", carouselSchema);
