import { faker } from '@faker-js/faker';
import httpMocks from 'node-mocks-http';
import IdeaController from './../ideas';

describe('Controller - ideas', () => {
    let controller, database;
    let res;
    let ideaId;
    const JSON_404 = { detail: 'Idea not found' };

    beforeEach(() => {
        database = {};
        controller = new IdeaController(database);
        res = httpMocks.createResponse();
        ideaId = +faker.random.numeric();
    });

    describe('getComments', () => {
        it('return 404 when idea does not exist', async () => {
            const res = httpMocks.createResponse();
            const req = httpMocks.createRequest({
                params: { id: ideaId },
            });
            database.findById = jest.fn((id) => Promise.resolve(null));
            database.getComments = jest.fn((id, page) => Promise.resolve());

            await controller.getComments(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toEqual(JSON_404);
            expect(database.findById).toBeCalledWith(ideaId);
            expect(database.getComments).not.toBeCalled();
        });
        it('return 200 with page param', async () => {
            const page = +faker.random.numeric(1);
            const req = httpMocks.createRequest({
                params: { id: ideaId },
                query: { page },
            });
            database.findById = jest.fn((id) => Promise.resolve({}));
            database.getComments = jest.fn((id, page) => Promise.resolve());

            await controller.getComments(req, res);

            expect(res.statusCode).toBe(200);
            expect(database.getComments).toBeCalledWith(ideaId, page);
        });

        it('return 200 without page param', async () => {
            const page = NaN;
            const req = httpMocks.createRequest({
                params: { id: ideaId },
                query: { page },
            });
            database.findById = jest.fn((id) => Promise.resolve({}));
            database.getComments = jest.fn((id, page) => Promise.resolve());

            await controller.getComments(req, res);

            expect(res.statusCode).toBe(200);
            expect(database.getComments).toBeCalledWith(ideaId, 1);
        });
    });

    describe('createComment', () => {
        let userId, id, text;

        beforeEach(() => {
            userId = +faker.random.numeric(1);
            id = +faker.random.numeric(1);
            text = faker.random.alpha(10);
        });

        it('return 201', async () => {
            const req = httpMocks.createRequest({
                body: { text },
                params: { id },
                userId,
            });
            database.findById = jest.fn((id) => Promise.resolve({}));
            database.createComment = jest.fn((id, userId, text) =>
                Promise.resolve()
            );

            await controller.createComment(req, res);

            expect(res.statusCode).toBe(201);
            expect(database.findById).toBeCalledWith(id);
            expect(database.createComment).toBeCalledWith(id, userId, text);
        });

        it('return 404', async () => {
            const req = httpMocks.createRequest({
                body: { text },
                params: { id },
                userId,
            });
            database.findById = jest.fn((id) => Promise.resolve(null));
            database.createComment = jest.fn((id, userId, text) =>
                Promise.resolve()
            );

            await controller.createComment(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toEqual(JSON_404);
            expect(database.findById).toBeCalledWith(id);
            expect(database.createComment).not.toBeCalled();
        });
    });

    describe('createLike', () => {
        let id, userId;
        beforeEach(() => {
            id = +faker.random.numeric();
            userId = +faker.random.numeric();
        });

        it('return 201', async () => {
            const req = httpMocks.createRequest({ params: { id }, userId });
            database.findById = jest.fn((id) => Promise.resolve({}));
            database.createLike = jest.fn((id, userId) => Promise.resolve(1));

            await controller.createLike(req, res);

            expect(res.statusCode).toBe(201);
            expect(database.findById).toBeCalledWith(id);
            expect(database.createLike).toBeCalledWith(id, userId);
        });

        it('return 400 when like already done', async () => {
            const req = httpMocks.createRequest({ params: { id }, userId });
            database.findById = jest.fn((id) => Promise.resolve({}));
            database.createLike = jest.fn((id, userId) => Promise.resolve(0));

            await controller.createLike(req, res);

            expect(database.findById).toBeCalledWith(id);
            expect(res.statusCode).toBe(400);
        });

        it('return 404 when idea does not exist', async () => {
            const req = httpMocks.createRequest({ params: { id }, userId });
            database.findById = jest.fn((id) => Promise.resolve(null));
            database.createLike = jest.fn((id, userId) => Promise.resolve(0));

            await controller.createLike(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toEqual(JSON_404);
            expect(database.createLike).not.toBeCalled();
        });
    });
});
