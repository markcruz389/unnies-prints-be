import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieSession from 'cookie-session';
import passport from 'passport';
import { Strategy } from 'passport-local';

import loggingMiddleware from '../_middlewares/logging';
import authRouter from '../auth/auth.router';
import { authenticateUserLocal } from '../users/users.model';

dotenv.config();

const config = {
    COOKIE_KEY_1: process.env.COOKIE_KEY_1 || '',
    COOKIE_KEY_2: process.env.COOKIE_KEY_2 || '',
    NODE_ENV: process.env.NODE_ENV,
};

type User = {
    id?: string;
};

const initializeApp = () => {
    passport.use(
        new Strategy(async function verify(username, password, done) {
            const user = await authenticateUserLocal(username, password);

            if (!user) {
                return done(null, false);
            }

            return done(null, user);
        })
    );
    passport.serializeUser((user: User, done) => {
        done(null, user);
    });
    passport.deserializeUser((user: User, done) => done(null, user));

    const app = express();

    // TODO * update cors
    app.use(cors({ origin: 'https://localhost:3000', credentials: true }));

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
            httpOnly: true,
            sameSite: false,
            secure: true,
            signed: true,
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
