import { createServer } from 'http';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import prisma from './prisma/client';

const startServer = async () => {
    const app = express();
    const httpServer = createServer(app);

    // The GraphQL schema
    const typeDefs = gql`
        enum Mode {
            WRITING
            REVISING
        }

        type Query {
            hello: String
        }

        type Query {
            projects: [Project]
        }

        type Query {
            project(id: Int!): Project
        }

        type Query {
            documents: [Document]
        }

        type Query {
            document(id: Int!): Document
        }

        type Project {
            id: Int!
            name: String!
            description: String
            currentCycle: Int!
            currentMode: Mode!
            createdAt: String!
            updatedAt: String!
            Document: [Document]
        }

        type Document {
            id: String!
            content: String!
            createdAt: String!
            updatedAt: String!
            cycle: Int!
            mode: Mode!
            project: Project!
            projectId: Int!
        }
    `;

    // Handle logic and response for each typeDef query/mutation
    // e.g. Fetch a list of items from a database
    const resolvers = {
        Query: {
            hello: () => 'Hello world!',
            projects: async () => await prisma.project.findMany(),
            documents: async () => await prisma.document.findMany(),
            // project: async (id: number) => await prisma.project.findUnique({ where: { id } }),
            // document: async (id: number) => await prisma.document.findUnique({ where: { id } })
            project: async (_parent: any, args: any) =>
                await prisma.project.findUnique({ where: { id: args.id } })
        }
    };

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers
    });

    await apolloServer.start();

    // Applies the ApolloServer instance to Express as middleware.
    apolloServer.applyMiddleware({
        app,
        path: '/api' // path for the GraphQL endpoint
    });

    httpServer.listen({ port: process.env.PORT || 4000 }, () =>
        console.log(`Server listening on http://localhost:4000${apolloServer.graphqlPath}`)
    );
};

startServer();
