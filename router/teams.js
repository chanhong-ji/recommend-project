import express from 'express';
import { body, param } from 'express-validator';
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

    const validateCreateProject = [
        body('title').trim().notEmpty(),
        body('goal').trim(),
        validate,
    ];

    const validateParams = [param('id').isInt().toInt(), validate];

    router.post('/', auth, validateCreate, teamController.create);

    router.get('/', auth, teamController.list);

    router.post('/join', auth, validateParticapate, teamController.participate);

    router.get('/:id', validateParams, auth, isMember, teamController.retreive);

    router.post(
        '/:id/projects',
        validateParams,
        auth,
        isLeader,
        validateCreateProject,
        teamController.createProject
    );

    router.get(
        '/:id/projects',
        validateParams,
        auth,
        isMember,
        teamController.getProjects
    );

    return router;
}
