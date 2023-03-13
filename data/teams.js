import client from './../db/client.js';

export const createTeam = async (name, password, leaderId) =>
    client.team.create({
        data: {
            name,
            password,
            leaderId,
            members: { connect: { id: leaderId } },
        },
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

export const createProject = async (title, goal, teamId) =>
    client.project.create({
        data: {
            title,
            goal,
            teamId,
        },
        select: {
            id: true,
            title: true,
            goal: true,
        },
    });

export const getProjectsById = async (teamId) =>
    client.project.findMany({
        where: {
            teamId,
        },
        select: {
            id: true,
            title: true,
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

export const checkIsLeader = async (teamId, userId) =>
    client.team
        .count({
            where: {
                id: teamId,
                leaderId: userId,
            },
        })
        .then((result) => !!result);
