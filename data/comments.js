import client from './../db/client.js';

export const createLike = async (commentId, userId) =>
    client.like
        .count({
            where: {
                userId,
                commentId,
            },
        })
        .then(async (result) => {
            if (result > 0) return 0;
            return client.like
                .create({
                    data: {
                        userId,
                        commentId,
                    },
                })
                .then(() => 1);
        });
