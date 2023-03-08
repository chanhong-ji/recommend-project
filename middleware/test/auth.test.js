import httpMock from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import { faker } from '@faker-js/faker';
import { auth } from '../auth.js';
import * as database from '../../data/users.js';

jest.mock('jsonwebtoken');
jest.mock('../../data/users.js');

describe('Auth', () => {
    it('return 401 when empty authorization header', () => {
        const req = httpMock.createRequest();
        const res = httpMock.createResponse();
        const next = jest.fn();

        auth(req, res, next);

        expect(res.statusCode).toBe(401);
    });

    it('return 401 when unsupported header format', () => {
        const req = httpMock.createRequest({
            headers: {
                authorization: 'Wrong',
            },
        });
        const res = httpMock.createResponse();
        const next = jest.fn();

        auth(req, res, next);

        expect(res.statusCode).toBe(401);
        expect(res._getJSONData()).toEqual({ detail: 'Authentication error' });
        expect(next).not.toBeCalled();
    });

    describe('After header validation', () => {
        let req, res, next, token;
        beforeEach(() => {
            token = faker.random.alphaNumeric(8);
            req = httpMock.createRequest({
                headers: {
                    authorization: 'Bearer ' + token,
                },
            });
            res = httpMock.createResponse();
            next = jest.fn();
        });

        it('return 401 when jwt occurs error', () => {
            const verify = jest.fn((token, secretKey, callback) => {
                callback(new Error('error'), undefined);
            });
            jwt.verify = verify;

            auth(req, res, next);

            expect(verify).toBeCalled();
            expect(res.statusCode).toBe(401);
            expect(next).not.toBeCalled();
        });

        describe('After token verified', () => {
            it('return 401 when no user in database', async () => {
                const decoded = { id: faker.random.numeric(1) };
                jwt.verify = (token, secret, callback) => {
                    callback(null, decoded);
                };
                const findById = jest.fn((id) => Promise.resolve(null));
                database.findById = findById;

                await auth(req, res, next);

                expect(res.statusCode).toBe(401);
                expect(findById).toBeCalled();
                expect(next).not.toBeCalled();
            });

            it('pass req', async () => {
                const userId = faker.random.alpha(3);
                jwt.verify = (token, secret, callback) => {
                    callback(null, { id: userId });
                };
                database.findById = (id) => Promise.resolve({ id });

                await auth(req, res, next);

                expect(req).toMatchObject({ userId, token });
                expect(next).toBeCalled();
            });
        });
    });
});
