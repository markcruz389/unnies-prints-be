import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import { PassportStatic } from 'passport';

import loggingMiddleware from '../_middlewares/logging';
import authRouter from '../auth/auth.router';

dotenv.config();

const config = {
    COOKIE_KEY_1: process.env.COOKIE_KEY_1 || '',
    COOKIE_KEY_2: process.env.COOKIE_KEY_2 || '',
    NODE_ENV: process.env.NODE_ENV,
};

const initializeApp = (passport: PassportStatic) => {
    const app = express();

    // TODO * update cors
    app.use(cors());

    app.use(
        helmet({
            contentSecurityPolicy:
                config.NODE_ENV === 'production' ? undefined : false,
        })
    );

    app.use(loggingMiddleware);

    app.use(
        cookieSession({
            name: 'session',
            maxAge: 24 * 60 * 60 * 1000,
            keys: [config.COOKIE_KEY_1, config.COOKIE_KEY_2],
        })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(express.json());

    app.use(authRouter);

    return app;
};

export default initializeApp;
