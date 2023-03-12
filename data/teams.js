import client from './../db/client.js';

export const createTeam = async (data) =>
    client.team.create({
        data,
        select: {
            code: true,
            name: true,
        },
    });

export const findAllByUserId = async (userId) =>
    client.user.findUnique({ where: { id: userId } }).teams({
        select: {
            id: true,
            name: true,
        },
    });

export const findByCode = async (code) =>
    client.team.findUnique({
        where: { code },
        select: { code: true, password: true, id: true },
    });

export const updateTeamWithMember = async (teamId, userId) =>
    client.team.update({
        where: { id: teamId },
        data: { members: { connect: { id: userId } } },
    });

export const findById = async (teamId) =>
    client.team.findUnique({
        where: { id: teamId },
        select: {
            members: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            name: true,
        },
    });

// Middleware
export const checkIsMember = async (teamId, userId) =>
    client.user
        .findFirst({
            where: { id: userId, teams: { some: { id: teamId } } },
        })
        .then((result) => {
            if (result) return true;
            return false;
        });
