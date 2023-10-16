import express from 'express';
import { param } from 'express-validator';
import { auth } from './../middleware/auth.js';
import { validate } from './../middleware/validator.js';

const router = express.Router();

export default function commentRouter(commentController) {
    const validateParams = [param('id').isInt().toInt(), validate];

    router.post(
        '/:id/likes',
        validateParams,
        auth,
        commentController.createLike
    );
    return router;
}
