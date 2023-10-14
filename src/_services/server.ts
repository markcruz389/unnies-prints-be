import https from 'https';
import path from 'path';
import fs from 'fs';
import { Express } from 'express';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFilesSync } from '@graphql-tools/load-files';

// Resource: https://www.apollographql.com/docs/apollo-server/security/terminating-ssl/

const createHttpAndApolloServer = (app: Express) => {
    const httpServer = https.createServer(
        {
            key: fs.readFileSync('key.pem'),
            cert: fs.readFileSync('cert.pem'),
        },
        app
    );

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

    const apolloServer = new ApolloServer({
        schema,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    return { httpServer, apolloServer };
};

export default createHttpAndApolloServer;
