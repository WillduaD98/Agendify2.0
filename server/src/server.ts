import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import db from './config/db.js';
import type { GraphQLFormattedError } from 'graphql';

dotenv.config();
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  formatError: (formattedError: GraphQLFormattedError) => {
    return {
      message: formattedError.message,
      path: formattedError.path || [],
      code: (formattedError.extensions as any)?.code || 'INTERNAL_SERVER_ERROR'
    };
  }
});

const startApolloServer = async () => {
  await server.start();
  await db();

  const app = express();
  const PORT = process.env.PORT || 3001;

  // Habilitar CORS para permitir acceso desde tu frontend en Render
  app.use(cors({
    origin: 'https://agendify2-0-1.onrender.com', // ✅ Reemplaza con tu frontend URL real
    credentials: true,
  }));

  app.use(express.json());

  app.use((req, _res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
  });

  app.use('/graphql', expressMiddleware(server, { context: authenticateToken }));

  // ❌ Ya no servimos frontend desde aquí

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 GraphQL available at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
