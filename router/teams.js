import express from 'express';
import { body } from 'express-validator';
import { auth } from './../middleware/auth.js';
import { validate } from './../middleware/validator.js';
import { isMember } from './../middleware/isMember.js';
import { isLeader } from './../middleware/isLeader.js';

const router = express.Router();

export default function teamRouter(teamController) {
    const validateCreate = [
        body('name').trim().notEmpty(),
        body('password').trim().notEmpty().withMessage('password is required'),
        validate,
    ];

    const validateParticapate = [
        body('code').trim().notEmpty().withMessage('code is required'),
        body('password').trim().notEmpty().withMessage('password is required'),
        validate,
    ];

    const validateAdd = [
        body('title').trim().notEmpty(),
        body('goal').trim().notEmpty(),
        validate,
    ];

    router.post('/', auth, validateCreate, teamController.create);

    router.get('/', auth, teamController.list);

    router.post('/join', auth, validateParticapate, teamController.participate);

    router.get('/:id', auth, isMember, teamController.retreive);

    router.post(
        '/:id/projects',
        auth,
        isLeader,
        validateAdd,
        teamController.add
    );

    router.get('/:id/projects', auth, isMember, teamController.listOfProjects);

    return router;
}
