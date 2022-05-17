import { createServer } from 'http';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

const startServer = async () => {
    const app = express();
    const httpServer = createServer(app);

    // The GraphQL schema
    const typeDefs = gql`
        type Query {
            hello: String
        }
    `;

    // Handle logic and response for each typeDef query/mutation
    // e.g. Fetch a list of items from a database
    const resolvers = {
        Query: {
            hello: () => 'Hello world!'
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
