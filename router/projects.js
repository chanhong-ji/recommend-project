import express from 'express';
import { body, oneOf } from 'express-validator';
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

    router.get('/:id', auth, isMember, projectController.retrieve);

    router.patch(
        '/:id',
        auth,
        isLeader,
        validateUpdate,
        projectController.update
    );

    // router.post('/:id/ideas', auth, projectController.createIdea);

    return router;
}
