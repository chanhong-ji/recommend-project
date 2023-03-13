import client from './../db/client.js';

export const getById = async (projectId) =>
    client.project.findUnique({
        where: { id: projectId },
        include: {
            ideas: {
                select: {
                    id: true,
                },
            },
        },
    });

export const updateById = async (projectId, data) =>
    client.project.update({
        where: { id: projectId },
        select: { id: true, title: true, goal: true },
        data,
    });

export const checkIsMember = async (projectId, userId) =>
    client.team
        .count({
            where: {
                projects: { some: { id: projectId } },
                members: { some: { id: userId } },
            },
        })
        .then((result) => !!result);

export const checkIsLeader = async (projectId, userId) =>
    client.team
        .count({
            where: {
                projects: { some: { id: projectId } },
                leaderId: userId,
            },
        })
        .then((result) => !!result);
