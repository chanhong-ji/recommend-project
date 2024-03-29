import express from 'express';
import { body, oneOf, param } from 'express-validator';
import { auth } from '../middleware/auth.js';
import { validate } from './../middleware/validator.js';

const router = express.Router();

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
            .isEmail({ min: 5 })
            .withMessage('Invalid email format'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('password is required')
            .isLength({ min: 5 })
            .withMessage('password should be more than 4'),
        validate,
    ];

    const validateUpdate = [
        oneOf([
            body('username')
                .trim()
                .isLength({ min: 3 })
                .withMessage('username should be more than 4'),
            body('email').trim().isEmail().withMessage('Invalid email format'),
            body('avatar').trim().isURL(),
        ]),
        validate,
    ];

    const validateProfile = [param('id').isInt().toInt(), validate];

    router.post('/', validateSignup, userController.signup);

    router.post('/login', validateLogin, userController.login);

    router.get('/me', auth, userController.me);

    router.post('/edit', auth, validateUpdate, userController.update);

    router.get('/csrf-token', userController.csrfToken);

    router.get('/logout', userController.logout);

    router.get('/:id', validateProfile, userController.profile);

    return router;
}
