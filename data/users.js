import { DataTypes } from 'sequelize';
import { sequelize } from '../db/database.js';

export const User = sequelize.define(
    'user',
    {
        username: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        // category
    },
    { timestamps: false }
);

export const createUser = async (user) => {
    return User.create(user).then((data) => data.dataValues.id);
};

export const findByEmail = async (email) => {
    return User.findOne({ where: { email } }).then((data) => {
        if (!data) return null;
        return data.dataValues;
    });
};

export const findById = async (id) => {
    return User.findByPk(id).then((data) => {
        if (!data) return null;
        return data.dataValues;
    });
};
