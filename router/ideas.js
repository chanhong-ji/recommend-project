import express from 'express';
import { body, param, query } from 'express-validator';
import { auth } from './../middleware/auth.js';
import { validate } from './../middleware/validator.js';

const router = express.Router();

export default function IdeaRouter(IdeaController) {
    const validateGetComment = [query('page').isInt().toInt(), validate];

    const validateCreateComment = [body('text').trim().notEmpty(), validate];

    const validateParams = [param('id').isInt().toInt(), validate];

    router.get(
        '/:id/comments',
        validateParams,
        validateGetComment,
        auth,
        IdeaController.getComments
    );

    router.post(
        '/:id/comments',
        validateParams,
        auth,
        validateCreateComment,
        IdeaController.createComment
    );

    router.post('/:id/likes', validateParams, auth, IdeaController.createLike);

    return router;
}
