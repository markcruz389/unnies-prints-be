import http from 'http';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';

dotenv.config();

const PORT = process.env.PORT;

async function startApolloServer() {
    const app = express();

    const httpServer = http.createServer(app);

    const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'));
    const resolversArray = loadFilesSync(
        path.join(__dirname, '**/*.resolvers.ts')
    );

    const schema = makeExecutableSchema({
        typeDefs: typesArray,
        resolvers: resolversArray,
    });

    const server = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use('/graphql', express.json(), expressMiddleware(server));

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

startApolloServer();
