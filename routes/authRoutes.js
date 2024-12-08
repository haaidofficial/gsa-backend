const express = require('express');
const { signup, login, updateAccount, getAccountDetails } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const { body } = require('express-validator');
const { validateUpdateAccount, validateLogin, validateSignUp } = require('../utils/validators');
const validationErrorHandler = require('../middlewares/validationErrorHandler');
const router = express.Router();

router.post(
    '/signup',
    validateSignUp,
    validationErrorHandler,
    signup
);

router.post(
    '/login',
    validateLogin,
    login
);

router.put(
    '/update-account',
    authMiddleware,
    validateUpdateAccount,
    validationErrorHandler,
    updateAccount
);

router.get(
    '/account-details',
    authMiddleware,
    getAccountDetails
);


module.exports = router;
