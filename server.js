import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
import yaml from 'yamljs';
import { config } from './config.js';
import { csrfCheck } from './middleware/csrf.js';
import userRouter from './router/users.js';
import teamRouter from './router/teams.js';
import projectRouter from './router/projects.js';
import IdeaRouter from './router/ideas.js';
import commentRouter from './router/comments.js';
import UserController from './controller/users.js';
import TeamController from './controller/teams.js';
import ProjectController from './controller/projects.js';
import IdeaController from './controller/ideas.js';
import CommentController from './controller/comments.js';
import * as userDatabase from './data/users.js';
import * as teamDatabase from './data/teams.js';
import * as projectDatabase from './data/projects.js';
import * as ideaDatabase from './data/ideas.js';
import * as commentDatabase from './data/comments.js';

export async function startapp() {
    const openAPIDocument = yaml.load('./api/openapi.yaml');
    const corsOptions = {
        origin: config.cors.allowedOrigin,
        credentials: true,
    };

    const app = express();
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Middleware
    app.use(csrfCheck);

    // Routers
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(openAPIDocument));
    app.use('/users', userRouter(new UserController(userDatabase)));
    app.use('/teams', teamRouter(new TeamController(teamDatabase)));
    app.use('/projects', projectRouter(new ProjectController(projectDatabase)));
    app.use('/ideas', IdeaRouter(new IdeaController(ideaDatabase)));
    app.use('/comments', commentRouter(new CommentController(commentDatabase)));

    app.use((error, req, res, next) => {
        console.error(error);
        res.sendStatus(500);
    });

    const server = app.listen(config.port);
    console.log('Server is ready!!');

    return server;
}

export function stopapp(server) {
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
