import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import ProjectController from './../projects';

describe('Project-Controller', () => {
    let database;
    let controller;
    let projectId;

    beforeEach(() => {
        database = {};
        controller = new ProjectController(database);
        projectId = +faker.random.numeric(3);
    });

    describe('retrieve', () => {
        it('return 200', async () => {
            const req = httpMocks.createRequest({ projectId });
            const res = httpMocks.createResponse();
            database.getById = jest.fn((projectId) => Promise.resolve({}));

            await controller.retrieve(req, res);

            expect(res.statusCode).toBe(200);
            expect(database.getById).toBeCalledWith(projectId);
        });
    });

    describe('update', () => {
        it('return 200', async () => {
            const title = faker.random.alpha(5);
            const goal = faker.random.alpha(5);
            const req = httpMocks.createRequest({
                projectId,
                body: { title, goal },
            });
            const res = httpMocks.createResponse();
            database.updateById = jest.fn((projectId, data) =>
                Promise.resolve({})
            );

            await controller.update(req, res);

            expect(res.statusCode).toBe(200);
            expect(database.updateById).toBeCalledWith(projectId, {
                title,
                goal,
            });
        });
    });

    describe('createIdea', () => {
        it('return 201', async () => {
            const text = faker.random.alpha(5);
            const projectId = +faker.random.numeric(3);
            database.createIdea = jest.fn((projectId, text) =>
                Promise.resolve({})
            );
            const req = httpMocks.createRequest({ body: { text }, projectId });
            const res = httpMocks.createResponse();

            await controller.createIdea(req, res);

            expect(res.statusCode).toBe(201);
            expect(database.createIdea).toBeCalledWith(projectId, text);
        });
    });

    describe('getIdeas', () => {
        let projectId;
        beforeEach(() => {
            projectId = +faker.random.numeric(3);
        });
        it('return 200 with page query', async () => {
            const page = +faker.random.numeric(1);
            database.getIdeas = jest.fn((projectId, page) =>
                Promise.resolve({})
            );
            const req = httpMocks.createRequest({ query: { page }, projectId });
            const res = httpMocks.createResponse();

            await controller.getIdeas(req, res);

            expect(res.statusCode).toBe(200);
            expect(database.getIdeas).toBeCalledWith(projectId, page);
        });

        it('return 200 without page query', async () => {
            const page = NaN;
            database.getIdeas = jest.fn((projectId, page) =>
                Promise.resolve({})
            );
            const req = httpMocks.createRequest({ query: { page }, projectId });
            const res = httpMocks.createResponse();

            await controller.getIdeas(req, res);

            expect(res.statusCode).toBe(200);
            expect(database.getIdeas).toBeCalledWith(projectId, 1);
        });
    });
});
