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
});
