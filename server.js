import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from './config.js';
import { sequelize } from './db/database.js';
import userRouter from './router/users.js';
import UserController from './controller/users.js';
import * as userDatabase from './data/users.js';

export async function startapp() {
    const corsOptions = {
        credentials: true,
    };

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: true }));
    app.use((error, req, res, next) => {
        console.error(error);
        res.sendStatus(500);
    });
    app.use('/users', userRouter(new UserController(userDatabase)));

    await sequelize.sync();

    const server = app.listen(config.port);
    console.log('Server is ready!!');

    return server;
}

function stopapp(server) {
    return new Promise((resolve, reject) => {
        server.close(async () => {
            try {
                await sequelize.close();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
}
