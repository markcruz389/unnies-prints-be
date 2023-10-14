import dotenv from 'dotenv';
import { expressMiddleware } from '@apollo/server/express4';

import { mongoConnect } from './_services/mongo';
import createApolloServer from './_services/server';
import { CustomError, errorHandler } from './_middlewares/errorHandler';
import initializeApp from './_services/app';

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL || '';

async function startApolloServer() {
    const app = initializeApp();

    const { httpServer, apolloServer } = createApolloServer(app);
    await Promise.all([apolloServer.start(), mongoConnect(MONGO_URL)]);

    app.use(
        '/graphql',
        expressMiddleware(apolloServer, {
            context: async ({ req, res }) => {
                return { req, res };
            },
        })
    );

    app.use('*', (req, _, next) => {
        const error = new CustomError(404, `${req.baseUrl} not found`);
        next(error);
    });

    app.use(errorHandler);

    await new Promise<void>((resolve) =>
        httpServer.listen({ port: PORT }, resolve)
    );

    console.log('🚀 Server ready at port 8000');
}

startApolloServer();
