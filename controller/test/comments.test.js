import CommentController from './../comments';
import { faker } from '@faker-js/faker';
import httpMocks from 'node-mocks-http';

describe('Controller - Comment', () => {
    let database;
    let controller;
    const JSON_404 = { detail: 'comment not found' };

    beforeEach(() => {
        database = {};
        controller = new CommentController(database);
    });
    describe('createLike', () => {
        let id, userId;
        beforeEach(() => {
            id = +faker.random.numeric();
            userId = +faker.random.numeric();
        });

        it('return 404 when comment does not exist', async () => {
            const req = httpMocks.createRequest({
                userId,
                params: { id },
            });
            const res = httpMocks.createResponse();
            database.findById = jest.fn((id) => Promise.resolve(null));
            database.createLike = jest.fn((id, userId) => Promise.resolve(0));

            await controller.createLike(req, res);

            expect(res.statusCode).toBe(404);
            expect(database.findById).toBeCalledWith(id);
            expect(database.createLike).not.toBeCalled();
            expect(res._getJSONData()).toEqual(JSON_404);
        });

        it('return 400 when like already exist', async () => {
            const req = httpMocks.createRequest({
                userId,
                params: { id },
            });
            const res = httpMocks.createResponse();
            database.findById = jest.fn((id) => Promise.resolve({}));
            database.createLike = jest.fn((id, userId) => Promise.resolve(0));

            await controller.createLike(req, res);

            expect(res.statusCode).toBe(400);
            expect(database.createLike).toBeCalledWith(id, userId);
            expect(res._getJSONData()).toEqual({ detail: 'already done' });
        });

        it('return 201', async () => {
            const req = httpMocks.createRequest({
                userId,
                params: { id },
            });
            const res = httpMocks.createResponse();
            database.findById = jest.fn((id) => Promise.resolve({}));
            database.createLike = jest.fn((id, userId) => Promise.resolve(1));

            await controller.createLike(req, res);

            expect(res.statusCode).toBe(201);
        });
    });
});
