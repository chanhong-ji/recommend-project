import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from './config.js';
import userRouter from './router/users.js';
import teamRouter from './router/teams.js';
import UserController from './controller/users.js';
import TeamController from './controller/teams.js';
import * as userDatabase from './data/users.js';
import * as teamDatabase from './data/teams.js';

export async function startapp() {
    const corsOptions = {
        credentials: true,
    };

    const app = express();
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: true }));

    // routers
    app.use('/users', userRouter(new UserController(userDatabase)));
    app.use('/teams', teamRouter(new TeamController(teamDatabase)));

    app.use((error, req, res, next) => {
        console.error(error);
        res.sendStatus(500);
    });

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
