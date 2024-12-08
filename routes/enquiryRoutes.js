const express = require('express');
const router = express.Router();

const { submitEnquiry, getAllEnquiries, deleteEnquiry } = require("../controllers/enquiryController");
const authMiddleware = require('../middlewares/authMiddleware');
const { validateEnquiry } = require('../utils/validators');
const validationErrorHandler = require('../middlewares/validationErrorHandler');

router.post('/create-enquiry', validateEnquiry, validationErrorHandler, submitEnquiry);
router.get('/get-enquiries', authMiddleware, getAllEnquiries);
router.delete('/delete-enquiry/:enquiryId', authMiddleware, deleteEnquiry);

module.exports = router;