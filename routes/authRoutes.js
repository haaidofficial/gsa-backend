const express = require('express');
const { signup, login, updateAccount, getAccountDetails } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/update-account',

    authMiddleware,
    [
        // Validate and sanitize inputs
        body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
        body('email').optional().isEmail().withMessage('Invalid email format'),
        body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
        body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    ],


    updateAccount);

router.get('/account-details', authMiddleware, getAccountDetails);
// router.put('/update-account', authMiddleware, updateAccount);

module.exports = router;
