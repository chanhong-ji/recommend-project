import express from 'express';
import { body, param, query } from 'express-validator';
import { auth } from './../middleware/auth.js';
import { validate } from './../middleware/validator.js';

const router = express.Router();

export default function IdeaRouter(IdeaController) {
    const validateGetComment = [
        param('id').toInt(),
        query('page').toInt(),
        validate,
    ];

    const validateCreateComment = [
        param('id').toInt(),
        body('text').trim().notEmpty(),
        validate,
    ];

    const validateCreateLike = [param('id').toInt(), validate];

    router.get(
        '/:id/comments',
        validateGetComment,
        auth,
        IdeaController.getComments
    );

    router.post(
        '/:id/comments',
        validateCreateComment,
        auth,
        IdeaController.createComment
    );

    router.post(
        '/:id/likes',
        validateCreateLike,
        auth,
        IdeaController.createLike
    );

    return router;
}
