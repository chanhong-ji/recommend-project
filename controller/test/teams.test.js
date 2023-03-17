import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import TeamController from './../teams.js';
import { config } from './../../config';

jest.mock('bcrypt');

describe('Team-Controller', () => {
    let database;
    let controller;
    let req, res;
    let userId;

    beforeEach(() => {
        database = {};
        controller = new TeamController(database);
        userId = faker.random.numeric(3);
    });

    describe('create', () => {
        let name, password;
        beforeEach(() => {
            name = faker.internet.userName();
            password = faker.internet.password();
        });

        it('return 201', async () => {
            req = httpMocks.createRequest({
                body: { name, password },
                userId,
            });
            res = httpMocks.createResponse();
            bcrypt.hash = jest.fn((password, salt) =>
                Promise.resolve(password)
            );
            database.createTeam = jest.fn((name, password, leaderId) =>
                Promise.resolve({ name })
            );

            await controller.create(req, res);

            expect(bcrypt.hash).toBeCalledWith(password, config.bcrypt.salt);
            expect(database.createTeam).toBeCalledWith(name, password, userId);
            expect(res.statusCode).toBe(201);
        });
    });

    describe('list', () => {
        it('return 200 & array of team', async () => {
            req = httpMocks.createRequest({ userId });
            res = httpMocks.createResponse();
            database.findAllByUserId = jest.fn((userId) => Promise.resolve([]));

            await controller.list(req, res);

            expect(res.statusCode).toBe(200);
            expect(database.findAllByUserId).toBeCalledWith(userId);
        });
    });

    describe('participate', () => {
        let code, InputPassword;

        beforeEach(() => {
            code = faker.random.alphaNumeric();
            InputPassword = faker.internet.password();
            req = httpMocks.createRequest({
                body: { code, password: InputPassword },
                userId,
            });
            res = httpMocks.createResponse();
        });

        it('return 404 when team not found', async () => {
            database.findByCode = jest.fn((code) => Promise.resolve(null));

            await controller.participate(req, res);

            expect(res.statusCode).toBe(404);
            expect(database.findByCode).toBeCalledWith(code);
            expect(res._getJSONData()).toEqual({ detail: 'Team not found' });
        });

        describe('PASS team found', () => {
            let teamPassword;
            let teamId;
            beforeEach(() => {
                teamPassword = faker.internet.password();
                teamId = faker.random.numeric(3);
                database.findByCode = jest.fn((code) =>
                    Promise.resolve({
                        password: teamPassword,
                        id: teamId,
                    })
                );
            });

            it('return 401 when team password wrong', async () => {
                bcrypt.compare = jest.fn((password, teamPassword) =>
                    Promise.resolve(false)
                );

                await controller.participate(req, res);

                expect(res.statusCode).toBe(401);
                expect(bcrypt.compare).toBeCalledWith(
                    InputPassword,
                    teamPassword
                );
            });

            it('return 200 & teamId', async () => {
                bcrypt.compare = jest.fn((password, teamPassword) =>
                    Promise.resolve(true)
                );
                database.updateTeamWithMember = jest.fn();

                await controller.participate(req, res);

                expect(res.statusCode).toBe(200);
                expect(database.updateTeamWithMember).toBeCalledWith(
                    teamId,
                    userId
                );
            });
        });
    });

    describe('retreive', () => {
        let teamId;
        beforeEach(() => {
            teamId = faker.random.numeric();
            req = httpMocks.createRequest({ teamId });
            res = httpMocks.createResponse();
        });

        it('return 200 & team', async () => {
            database.findById = jest.fn((teamId) =>
                Promise.resolve({ id: teamId })
            );

            await controller.retreive(req, res);

            expect(res.statusCode).toBe(200);
            expect(database.findById).toBeCalledWith(teamId);
        });
    });

    describe('add', () => {
        it('return 201 & project', async () => {
            const teamId = +faker.random.numeric();
            const title = faker.random.alpha(5);
            const goal = faker.random.alpha(10);
            const req = httpMocks.createRequest({
                body: { title, goal },
                teamId,
            });
            const res = httpMocks.createResponse();
            database.createProject = jest.fn((title, goal, teamId) =>
                Promise.resolve({})
            );

            await controller.createProject(req, res);

            expect(res.statusCode).toBe(201);
            expect(database.createProject).toBeCalledWith(title, goal, teamId);
        });
    });

    describe('getProjects', () => {
        it('return 200', async () => {
            const teamId = +faker.random.numeric();
            database.getProjectsById = jest.fn((teamId) => Promise.resolve({}));
            const req = httpMocks.createRequest({ teamId });
            const res = httpMocks.createResponse();

            await controller.getProjects(req, res);

            expect(res.statusCode).toBe(200);
            expect(database.getProjectsById).toBeCalledWith(teamId);
        });
    });
});
