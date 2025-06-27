import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
// import cors from 'cors';
import { fileURLToPath } from 'url';
import { Request, Response } from 'express';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './services/auth.js';
import db from './config/db.js';
import type { GraphQLFormattedError } from 'graphql';

dotenv.config();
// process.env.NODE_ENV = process.env.NODE_ENV || 'development';

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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startApolloServer = async () => {
  await server.start();
  await db();

  const app = express();
  const PORT = process.env.PORT || 3001;

  // ✅ CORS configurado para permitir el frontend en producción
  // app.use(cors({
  //   origin: 'https://agendify2-0-1.onrender.com',
  //   credentials: true,
  // }));

  app.use(express.json());
  app.use((req, _res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
  });

  // 📡 Middleware de Apollo
  app.use('/graphql', expressMiddleware(server, { context: authenticateToken }));

  // ⚙️ Servir archivos solo si el frontend está en este mismo repo
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 GraphQL available at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
