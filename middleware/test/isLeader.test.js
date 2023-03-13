import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import { isLeader } from './../isLeader.js';
import * as teamDatabase from '../../data/teams.js';
import * as projectDatabase from '../../data/projects.js';

jest.mock('../../data/teams.js');
jest.mock('../../data/projects.js');

describe('Middleware - isLeader', () => {
    describe('path = "/teams"', () => {
        it('retrun 403 when not a member of team', async () => {
            const pathId = +faker.random.numeric(3);
            const userId = +faker.random.numeric(3);
            const req = httpMocks.createRequest({
                userId,
                params: { id: pathId },
                baseUrl: '/teams',
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();
            teamDatabase.checkIsLeader = jest.fn((pathId, userId) =>
                Promise.resolve(false)
            );

            await isLeader(req, res, next);

            expect(res.statusCode).toBe(403);
            expect(teamDatabase.checkIsLeader).toBeCalledWith(pathId, userId);
            expect(next).not.toBeCalled();
        });

        it('pass next', async () => {
            const pathId = +faker.random.numeric(3);
            const userId = +faker.random.numeric(3);
            const req = httpMocks.createRequest({
                userId,
                params: { id: pathId },
                baseUrl: '/teams',
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();
            teamDatabase.checkIsLeader = jest.fn((pathId, userId) =>
                Promise.resolve(true)
            );

            await isLeader(req, res, next);

            expect(req.teamId).toBe(pathId);
            expect(next).toBeCalled();
        });
    });

    describe('path == "/projects"', () => {
        it('return 403 when not a member of project', async () => {
            const pathId = +faker.random.numeric(3);
            const userId = +faker.random.numeric(3);
            const req = httpMocks.createRequest({
                userId,
                params: { id: pathId },
                baseUrl: '/projects',
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();
            projectDatabase.checkIsLeader = jest.fn((pathId, userId) =>
                Promise.resolve(false)
            );

            await isLeader(req, res, next);

            expect(res.statusCode).toBe(403);
            expect(projectDatabase.checkIsLeader).toBeCalledWith(
                pathId,
                userId
            );
            expect(next).not.toBeCalled();
        });

        it('pass next', async () => {
            const pathId = +faker.random.numeric(3);
            const userId = +faker.random.numeric(3);
            const req = httpMocks.createRequest({
                userId,
                params: { id: pathId },
                baseUrl: '/projects',
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();
            projectDatabase.checkIsLeader = jest.fn((pathId, userId) =>
                Promise.resolve(true)
            );

            await isLeader(req, res, next);

            expect(req.projectId).toBe(pathId);
            expect(next).toBeCalled();
        });
    });
});
