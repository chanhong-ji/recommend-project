import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import { isMember } from './../isMember.js';
import * as database from '../../data/teams.js';

jest.mock('../../data/teams.js');

describe('Middleware - isMember', () => {
    it('return 404 when path wrong', async () => {
        const pathId = faker.random.alpha();
        const req = httpMocks.createRequest({ params: { id: pathId } });
        const res = httpMocks.createResponse();
        next = jest.fn();

        await isMember(req, res, next);

        expect(res.statusCode).toBe(404);
        expect(next).not.toBeCalled();
    });

    it('retrun 403 when not a member of team', async () => {
        const pathId = faker.random.numeric(3);
        const userId = faker.random.numeric(3);
        const req = httpMocks.createRequest({ userId, params: { id: pathId } });
        const res = httpMocks.createResponse();
        const next = jest.fn();
        database.checkIsMember = jest.fn((pathId, userId) =>
            Promise.resolve(false)
        );

        await isMember(req, res, next);

        expect(res.statusCode).toBe(403);
        expect(database.checkIsMember).toBeCalledWith(+pathId, userId);
        expect(next).not.toBeCalled();
    });

    it('pass next', async () => {
        const pathId = faker.random.numeric(3);
        const userId = faker.random.numeric(3);
        const req = httpMocks.createRequest({ userId, params: { id: pathId } });
        const res = httpMocks.createResponse();
        const next = jest.fn();
        database.checkIsMember = jest.fn((pathId, userId) =>
            Promise.resolve(true)
        );

        await isMember(req, res, next);

        expect(req.teamId).toBe(+pathId);
        expect(next).toBeCalled();
    });
});
