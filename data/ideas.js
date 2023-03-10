import client from './../db/client.js';

const PER_PAGE = 10;

export const getComments = async (ideaId, page) =>
    client.comment.findMany({
        where: {
            ideaId,
        },
        skip: (page - 1) * PER_PAGE,
        take: PER_PAGE,
        orderBy: {
            likes: {
                _count: 'desc',
            },
        },
        include: {
            _count: {
                select: { likes: true },
            },
        },
    });

export const createComment = async (ideaId, ownerId, text) =>
    client.comment.create({
        data: { text, ideaId, ownerId },
    });

export const createLike = async (ideaId, userId) =>
    client.like.create({
        data: {
            ideaId,
            userId,
        },
    });
