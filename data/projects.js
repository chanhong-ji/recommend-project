import client from './../db/client.js';

export const getById = async (projectId) =>
    client.project.findUnique({
        where: { id: projectId },
    });

export const updateById = async (projectId, data) =>
    client.project.update({
        where: { id: projectId },
        select: { id: true, title: true, goal: true },
        data,
    });

export const createIdea = async (projectId, text) =>
    client.idea.create({
        data: {
            text,
            projectId,
        },
    });

const PER_PAGE = 10;

export const getIdeas = async (projectId, page = 1) =>
    client.idea.findMany({
        where: { projectId },
        select: {
            id: true,
            text: true,
            createdAt: true,
            _count: {
                select: {
                    likes: true,
                },
            },
        },
        orderBy: {
            likes: {
                _count: 'desc',
            },
        },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
    });

// Middleware
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
