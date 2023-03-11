import express from 'express';
import { body, oneOf, validationResult } from 'express-validator';
import { auth } from '../middleware/auth.js';

const router = express.Router();

const validate = (req, res, next) => {
    const result = validationResult(req);

    if (result.errors.length == 0) {
        return next();
    }

    return res.status(400).json({ detail: result.errors[0].msg });
};

export default function userRouter(userController) {
    const validateLogin = [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format'),
        body('password').trim().notEmpty().withMessage('password is required'),
        validate,
    ];

    const validateSignup = [
        body('username')
            .trim()
            .isLength({ min: 3 })
            .withMessage('username should be more than 4'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Invalid email format'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 5 })
            .withMessage('password should be more than 4'),
        validate,
    ];

    const validateUpdate = oneOf([
        body('username')
            .trim()
            .isLength({ min: 3 })
            .withMessage('username should be more than 4'),
        body('email').trim().isEmail().withMessage('Invalid email format'),
        body('avatar').trim().isURL(),
    ]);

    router.post('/', validateSignup, userController.signup);

    router.post('/login', validateLogin, userController.login);

    router.get('/me', auth, userController.me);

    router.post('/edit', auth, validateUpdate, userController.update);

    router.get('/:id', userController.profile);

    return router;
}
