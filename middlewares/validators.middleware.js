const { body, validationResult } = require('express-validator');
const { AppError } = require('../utils/appError.util');

const checkResult = (req, res, next) => {
    const errors = validationResult(req);

    if( !errors.isEmpty() ) {
        const errorMsgs = errors.array().map(err => err.msg);
        const message = errorMsgs.join('. ');

        return next(new AppError(message, 400));
    }

    next();
};

const createUserValidators = [
    body('name').notEmpty().withMessage('Name cannot be empty'), 
    body('email').isEmail().withMessage('Must provide a valid email'), 
    body('password')
        .isLength({ min: 8 })
        .withMessage('Pwd must be at least 8 chars long')
        .isAlphanumeric()
        .withMessage('Pwd must contain an alphanumeric value'),
    checkResult
];

module.exports = { createUserValidators };