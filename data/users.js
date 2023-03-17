import client from './../db/client.js';

export const createUser = async (username, email, password) =>
    client.user.create({
        data: { username, email, password },
        select: { id: true },
    });

// for authentication
export const findByEmail = async (email) =>
    client.user.findUnique({
        where: {
            email,
        },
    });

export const findById = async (id) =>
    client.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            avatar: true,
        },
    });

export const updateById = async (userId, data) =>
    client.user.update({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            username: true,
            avatar: true,
        },
        data,
    });
