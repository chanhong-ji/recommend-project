import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserController from './../users';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('User Controller', () => {
    let userController;
    let database;
    beforeEach(() => {
        database = {};
        userController = new UserController(database);
    });

    describe('signup', () => {
        let username, email, password;
        let req, res;
        beforeEach(() => {
            username = faker.internet.userName();
            email = faker.internet.email();
            password = faker.internet.password();
            req = httpMocks.createRequest({
                body: { username, email, password },
            });
            res = httpMocks.createResponse();
        });

        it('return 201 when user successfully created', async () => {
            database.findByEmail = () => Promise.resolve(null);
            const userId = faker.random.alpha(3);
            bcrypt.hash = (password) => Promise.resolve(password);
            const createUser = jest.fn(({ username, email, password }) =>
                Promise.resolve(userId)
            );
            database.createUser = createUser;

            await userController.signup(req, res);

            expect(res.statusCode).toBe(201);
            expect(res._getJSONData()).toEqual({ userId });
            expect(createUser).toBeCalledWith({ username, email, password });
        });

        it('return 400 when email already exists', async () => {
            database.findByEmail = () =>
                Promise.resolve({ id: faker.random.alpha() });

            await userController.signup(req, res);

            expect(res.statusCode).toBe(400);
        });
    });

    describe('login', () => {
        let email, password;
        let req, res;

        beforeEach(() => {
            email = faker.internet.email();
            password = faker.internet.password();
            req = httpMocks.createRequest({ body: { email, password } });
            res = httpMocks.createResponse();
        });

        it('return 404 when user with the email not found', async () => {
            database.findByEmail = () => null;

            await userController.login(req, res);

            expect(res.statusCode).toBe(404);
            expect(res._getJSONData()).toEqual({
                detail: 'Not found with the email',
            });
        });

        it('return 401 when password wrong', async () => {
            database.findByEmail = () => ({ password });
            bcrypt.compare = () => false;

            await userController.login(req, res);

            expect(res.statusCode).toBe(401);
            expect(res._getJSONData()).toEqual({ detail: 'Password wrong' });
        });

        it('return 200', async () => {
            const token = faker.random.alpha(8);
            database.findByEmail = () => true;
            bcrypt.compare = () => true;
            jwt.sign = () => token;

            await userController.login(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ token });
        });
    });

    describe('me', () => {
        let req, res;
        let userId;
        beforeEach(() => {
            userId = faker.random.alpha(3);
            req = httpMocks.createRequest({ userId });
            res = httpMocks.createResponse();
        });

        it('return 404 when user not found with req.userId', async () => {
            database.findById = () => null;

            await userController.me(req, res);

            expect(res.statusCode).toBe(404);
        });

        it('return 200', async () => {
            database.findById = (userId) => ({ id: userId });

            await userController.me(req, res);

            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ userId });
        });
    });
});
