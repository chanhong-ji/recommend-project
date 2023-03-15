import httpMocks from 'node-mocks-http';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import { csrfCheck } from './../csrf.js';
import { config } from './../../config.js';

jest.mock('bcrypt');

describe('Middleware - csrfCheck', () => {
    it('pass next when method in get, head, options', async () => {
        const req = httpMocks.createRequest({ method: 'GET' });
        const res = httpMocks.createResponse();
        const next = jest.fn();

        csrfCheck(req, res, next);

        expect(next).toBeCalled();
    });

    it('return 403 when invalid csrfToken', async () => {
        const token = faker.random.alpha();
        const req = httpMocks.createRequest({
            method: 'POST',
            headers: {
                'csrf-token': token,
            },
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
        bcrypt.compare = jest.fn(() => Promise.resolve(false));

        await csrfCheck(req, res, next);

        expect(bcrypt.compare).toBeCalledWith(config.csrf.plainToken, token);
        expect(next).not.toBeCalled();
        expect(res.statusCode).toBe(403);
    });

    it('pass next when valid csrfToken', async () => {
        const token = faker.random.alpha();
        const req = httpMocks.createRequest({
            method: 'POST',
            headers: {
                'csrf-token': token,
            },
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
        bcrypt.compare = jest.fn(() => Promise.resolve(true));

        await csrfCheck(req, res, next);

        expect(next).toBeCalled();
    });

    it('return 500 when error occurs', async () => {
        const token = faker.random.alpha();
        const req = httpMocks.createRequest({
            method: 'POST',
            headers: {
                'csrf-token': token,
            },
        });
        const res = httpMocks.createResponse();
        const next = jest.fn();
        bcrypt.compare = jest.fn(() => Promise.reject(new Error()));

        await csrfCheck(req, res, next);

        expect(next).not.toBeCalled();
        expect(res.statusCode).toBe(500);
        expect(res._getJSONData()).toEqual({
            detail: 'CSRF Authentication fail',
        });
    });
});
