const express = require('express');
const router = express.Router();
const { handleContactForm } = require("../controllers/emailController");
const { validateContactForm } = require('../utils/validators');
const validationErrorHandler = require('../middlewares/validationErrorHandler');

router.post('/contact-form', validateContactForm, validationErrorHandler, handleContactForm);

module.exports = router;