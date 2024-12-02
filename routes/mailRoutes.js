const express = require('express');
const router = express.Router();
const { handleContactForm } = require("../controllers/emailController");

router.post('/contact-form', handleContactForm);

module.exports = router;