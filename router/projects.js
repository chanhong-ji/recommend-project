import express from 'express';
import { body, oneOf, param, query } from 'express-validator';
import { auth } from './../middleware/auth.js';
import { validate } from './../middleware/validator.js';
import { isMember } from './../middleware/isMember.js';
import { isLeader } from './../middleware/isLeader.js';

const router = express.Router();

export default function projectRouter(projectController) {
    const validateRetrieve = [param('id').toInt(), validate];

    const validateUpdate = [
        query('id').toInt(),
        oneOf([
            body('title').trim().notEmpty(),
            body('goal').trim().notEmpty(),
        ]),
        validate,
    ];

    const validateCreateIdea = [
        param('id').toInt(),
        body('text').trim().notEmpty(),
        validate,
    ];

    const validateGetIdeas = [param('id').toInt(), query('page').toInt()];

    router.get(
        '/:id',
        validateRetrieve,
        auth,
        isMember,
        projectController.retrieve
    );

    router.patch(
        '/:id',
        validateUpdate,
        auth,
        isLeader,
        projectController.update
    );

    router.post(
        '/:id/ideas',
        validateCreateIdea,
        auth,
        isMember,
        projectController.createIdea
    );

    router.get(
        '/:id/ideas',
        validateGetIdeas,
        auth,
        isMember,
        projectController.getIdeas
    );

    return router;
}
