import express from 'express';
import { body, param, query } from 'express-validator';
import { auth } from './../middleware/auth.js';
import { validate } from './../middleware/validator.js';

const router = express.Router();

export default function commentRouter(commentController) {
    const validateCreateLike = [param('id').toInt(), validate];

    router.post(
        '/:id/likes',
        validateCreateLike,
        auth,
        commentController.createLike
    );
    return router;
}
//
