import express from 'express';
import { body, param, query } from 'express-validator';
import { auth } from './../middleware/auth.js';
import { validate } from './../middleware/validator.js';
import { isFound } from './../middleware/isFound.js';

const router = express.Router();

export default function IdeaRouter(IdeaController) {
    const validateGetComment = [query('page').toInt(), validate];

    const validateCreateComment = [body('text').trim().notEmpty(), validate];

    const validateParams = [param('id').toInt(), validate];

    router.get(
        '/:id/comments',
        validateParams,
        validateGetComment,
        auth,
        isFound,
        IdeaController.getComments
    );

    router.post(
        '/:id/comments',
        validateParams,
        auth,
        isFound,
        validateCreateComment,
        IdeaController.createComment
    );

    router.post(
        '/:id/likes',
        validateParams,
        auth,
        isFound,
        IdeaController.createLike
    );

    return router;
}
