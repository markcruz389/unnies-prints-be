import dotenv from 'dotenv';
import { expressMiddleware } from '@apollo/server/express4';

import { mongoConnect } from './_services/mongo';
import createApolloServer from './_services/apolloServer';
import { CustomError, errorHandler } from './_middlewares/errorHandler';
import initializeApp from './_services/app';

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL || '';

async function startApolloServer() {
    const app = initializeApp();

    const server = createApolloServer(app);
    await Promise.all([server.start(), mongoConnect(MONGO_URL)]);

    app.use(
        '/graphql',
        expressMiddleware(server, {
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

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startApolloServer();
