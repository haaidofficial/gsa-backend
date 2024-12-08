const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const mailRoutes = require('./routes/mailRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static images

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes); // Add authentication routes
app.use('/api/email', mailRoutes);
app.use('/api/enquiries', enquiryRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI) // No need for additional options
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
