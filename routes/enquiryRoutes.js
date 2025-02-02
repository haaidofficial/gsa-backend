const express = require('express');
const router = express.Router();

const { submitEnquiry, getAllEnquiries, deleteEnquiry, submitNormalEnquiry } = require("../controllers/enquiryController");
const authMiddleware = require('../middlewares/authMiddleware');
const { validateEnquiry, validateNormalEnquiry } = require('../utils/validators');
const validationErrorHandler = require('../middlewares/validationErrorHandler');

router.post('/create-enquiry', validateEnquiry, validationErrorHandler, submitEnquiry);
router.post('/create-normal-enquiry', validateNormalEnquiry, validationErrorHandler, submitNormalEnquiry);
router.get('/get-enquiries', authMiddleware, getAllEnquiries);
router.delete('/delete-enquiry/:enquiryId', authMiddleware, deleteEnquiry);

module.exports = router;