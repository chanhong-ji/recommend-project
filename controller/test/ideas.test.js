import { faker } from '@faker-js/faker';
import httpMocks from 'node-mocks-http';
import IdeaController from './../ideas';

describe('Controller - ideas', () => {
    let controller, database;
    let res;
    let ideaId;

    beforeEach(() => {
        database = {};
        controller = new IdeaController(database);
        res = httpMocks.createResponse();
        ideaId = +faker.random.numeric();
    });

    describe('getComments', () => {
        it('return 200 with page params', async () => {
            const page = +faker.random.numeric(1);
            const req = httpMocks.createRequest({
                params: { id: ideaId },
                query: { page },
            });
            database.getComments = jest.fn((id, page) => Promise.resolve());

            await controller.getComments(req, res);

            expect(res.statusCode).toBe(200);
            expect(database.getComments).toBeCalledWith(ideaId, page);
        });

        it('return 200 with page params', async () => {
            const page = NaN;
            const req = httpMocks.createRequest({
                params: { id: ideaId },
                query: { page },
            });
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
            database.createComment = jest.fn((id, userId, text) =>
                Promise.resolve()
            );

            await controller.createComment(req, res);

            expect(res.statusCode).toBe(201);
            expect(database.createComment).toBeCalledWith(id, userId, text);
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
            database.createLike = jest.fn((id, userId) => Promise.resolve());

            await controller.createLike(req, res);

            expect(res.statusCode).toBe(201);
            expect(database.createLike).toBeCalledWith(id, userId);
        });
    });
});
