import { faker } from '@faker-js/faker';
import httpMocks from 'node-mocks-http';
import { isFound } from './../isFound.js';
import { findById as findIdeaById } from '../../data/ideas.js';
import { findById as findCommentById } from '../../data/comments.js';

jest.mock('../../data/ideas.js');
jest.mock('../../data/comments.js');

describe('Middlware - isFound', () => {
    describe('path = "/ideas"', () => {
        it('return 400 when idea not found', async () => {
            const id = +faker.random.numeric(3);
            const req = httpMocks.createRequest({
                baseUrl: '/ideas',
                params: { id },
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();
            findIdeaById.mockImplementation(() => Promise.resolve(0));

            await isFound(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(findIdeaById).toBeCalledWith(id);
            expect(next).not.toBeCalled();
        });

        it('pass next', async () => {
            const id = +faker.random.numeric(3);
            const req = httpMocks.createRequest({
                baseUrl: '/ideas',
                params: { id },
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();
            findIdeaById.mockImplementation(() => Promise.resolve(1));

            await isFound(req, res, next);

            expect(next).toBeCalled();
        });
    });

    describe('path = "/comments"', () => {
        it('return 400 when comment not found', async () => {
            const id = +faker.random.numeric(3);
            const req = httpMocks.createRequest({
                baseUrl: '/comments',
                params: { id },
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();
            findCommentById.mockImplementation(() => Promise.resolve(0));

            await isFound(req, res, next);

            expect(res.statusCode).toBe(400);
            expect(findCommentById).toBeCalledWith(id);
            expect(next).not.toBeCalled();
        });

        it('pass next', async () => {
            const id = +faker.random.numeric(3);
            const req = httpMocks.createRequest({
                baseUrl: '/comments',
                params: { id },
            });
            const res = httpMocks.createResponse();
            const next = jest.fn();
            findCommentById.mockImplementation(() => Promise.resolve(1));

            await isFound(req, res, next);

            expect(next).toBeCalled();
        });
    });
});
