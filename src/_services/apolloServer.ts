import http from 'http';
import path from 'path';
import { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';

const createApolloServer = (app: Express) => {
    const httpServer = http.createServer(app);

    const typesArray = loadFilesSync(
        path.join(__dirname, '..', '**/*.graphql')
    );
    const resolversArray = loadFilesSync(
        path.join(__dirname, '..', '**/*.resolvers.ts')
    );

    const schema = makeExecutableSchema({
        typeDefs: typesArray,
        resolvers: resolversArray,
    });

    return new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });
};

export default createApolloServer;
