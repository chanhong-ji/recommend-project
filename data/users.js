import client from './../db/client.js';

export const createUser = async (username, email, password) =>
    client.user.create({
        data: { username, email, password },
        select: { id: true },
    });

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
    client.user
        .update({
            where: { id: userId },
            data,
        })
        .catch((error) => 'error');
