import express from 'express';
import dotenv from 'dotenv';
import { expressMiddleware } from '@apollo/server/express4';
import passport from 'passport';
import cookieSession from 'cookie-session';

import { mongoConnect } from './_services/mongo';
import createApolloServer from './_services/apolloServer';
import initializePassportStrategy from './_services/passport';
import authRouter from './routes/auth.router';

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL || '';
const config = {
    COOKIE_KEY_1: process.env.COOKIE_KEY_1 || '',
    COOKIE_KEY_2: process.env.COOKIE_KEY_2 || '',
};

async function startApolloServer() {
    initializePassportStrategy(passport);

    const app = express();

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

    const server = createApolloServer(app);
    await Promise.all([server.start(), mongoConnect(MONGO_URL)]);

    app.use(authRouter);

    app.use(
        '/graphql',
        expressMiddleware(server, {
            context: async ({ req, res }) => {
                return { req, res };
            },
        })
    );

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startApolloServer();
