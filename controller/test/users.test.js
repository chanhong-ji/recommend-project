import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserController from '../users.js';
import { config } from './../../config.js';

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
            const userId = faker.random.numeric(3);
            bcrypt.hash = (password) => Promise.resolve(password);
            database.findByEmail = () => Promise.resolve(null);
            database.createUser = jest.fn((username, email, password) =>
                Promise.resolve({ id: userId })
            );

            await userController.signup(req, res);

            expect(res.statusCode).toBe(201);
            expect(database.createUser).toBeCalledWith(
                username,
                email,
                password
            );
        });

        it('return 400 when email already exists', async () => {
            database.findByEmail = () =>
                Promise.resolve({ id: faker.random.alpha() });

            await userController.signup(req, res);

            expect(res.statusCode).toBe(409);
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
            expect(res.cookies['token'].value).toBe(token);
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
            expect(res._getJSONData()).toMatchObject({ id: userId });
        });
    });

    describe('update', () => {
        let req, res;
        let username;
        let userId;
        let email;
        beforeEach(() => {
            username = faker.internet.userName();
            email = faker.internet.email();
            userId = faker.random.numeric(3);
            req = httpMocks.createRequest({ body: { username }, userId });
            res = httpMocks.createResponse();
        });

        it('return 200', async () => {
            const updateById = jest.fn((userId, data) => 1);
            database.updateById = updateById;

            await userController.update(req, res);

            expect(res.statusCode).toBe(200);
            expect(updateById).toBeCalledWith(userId, { username });
        });

        it('return 409 when email already taken', async () => {
            req = httpMocks.createRequest({ body: { email } });
            const findByEmail = jest.fn(() => Promise.resolve({ email }));
            database.findByEmail = findByEmail;

            await userController.update(req, res);

            expect(findByEmail).toBeCalled();
            expect(res.statusCode).toBe(409);
            expect(res._getJSONData()).toEqual({
                detail: 'Email already taken',
            });
        });
    });

    describe('profile', () => {
        let req, res;
        let id;

        beforeEach(() => {
            id = +faker.random.numeric(3);
            req = httpMocks.createRequest({ params: { id } });
            res = httpMocks.createResponse();
        });

        it('return 200', async () => {
            const findById = jest.fn((id) => Promise.resolve({ id }));
            database.findById = findById;

            await userController.profile(req, res);

            expect(findById).toBeCalledWith(id);
            expect(res.statusCode).toBe(200);
            expect(res._getJSONData()).toEqual({ id });
        });

        it('return 404 when user not found', async () => {
            database.findById = () => null;

            await userController.profile(req, res);

            expect(res.statusCode).toBe(404);
        });
    });

    describe('logout', () => {
        it('return 200', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();

            await userController.logout(req, res);

            expect(res.cookies['token'].value).toBe('');
            expect(res.statusCode).toBe(200);
        });
    });

    describe('csrfToken', () => {
        it('return 200 & csrfToken', async () => {
            const req = httpMocks.createRequest();
            const res = httpMocks.createResponse();
            bcrypt.hash = jest.fn((token, salt) => {});

            await userController.csrfToken(req, res);

            expect(res.statusCode).toBe(200);
            expect(bcrypt.hash).toBeCalledWith(config.csrf.plainToken, 1);
        });
    });
});
