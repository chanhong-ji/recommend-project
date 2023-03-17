import express from 'express';
import { body, oneOf, param, query } from 'express-validator';
import { auth } from './../middleware/auth.js';
import { validate } from './../middleware/validator.js';
import { isMember } from './../middleware/isMember.js';
import { isLeader } from './../middleware/isLeader.js';

const router = express.Router();

export default function projectRouter(projectController) {
    const validateUpdate = [
        oneOf([
            body('title').trim().notEmpty(),
            body('goal').trim().notEmpty(),
        ]),
        validate,
    ];

    const validateCreateIdea = [body('text').trim().notEmpty(), validate];

    const validateGetIdeas = [query('page').toInt(), validate];

    const validateParams = [param('id').toInt(), validate];

    router.get(
        '/:id',
        validateParams,
        auth,
        isMember,
        projectController.retrieve
    );

    router.patch(
        '/:id',
        validateParams,
        auth,
        isLeader,
        validateUpdate,
        projectController.update
    );

    router.post(
        '/:id/ideas',
        validateParams,
        auth,
        isMember,
        validateCreateIdea,
        projectController.createIdea
    );

    router.get(
        '/:id/ideas',
        validateParams,
        auth,
        isMember,
        validateGetIdeas,
        projectController.getIdeas
    );

    return router;
}
