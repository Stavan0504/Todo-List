import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import cors from 'cors';
import { typeDefs } from './graphQl/schema';
import resolvers from './graphQl/resolvers/resolvers';

const startServer = async () => {
  const app = express();

  // Create Apollo Server instance
  const server = new ApolloServer({ typeDefs, resolvers });

  // Start Apollo Server
  await server.start();

  // Apply Express middleware
  app.use(
    '/graphql',
    cors(), // Allow CORS
    bodyParser.json(),
    expressMiddleware(server)
  );

  // Start the Express server
  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
  });
};

startServer().catch((err) => console.error(err));
