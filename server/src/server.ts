import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { Request, Response } from 'express';

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
      code: (formattedError.extensions as any)?.code || 'INTERNAL_SERVER_ERROR',
    };
  },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startApolloServer = async () => {
  await server.start();
  await db();

  const app = express();
  const PORT = process.env.PORT || 3001;

  // ✅ CORS para frontend local y desplegado en Render
  const allowedOrigins = [
    'http://localhost:3000',
    'https://agendify2-0-1.onrender.com',
  ];

  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));

  app.use(express.json());
  app.use((req, _res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
  });

  app.use('/graphql', expressMiddleware(server, { context: authenticateToken }));

  // 🌐 Solo aplica si también sirvieras frontend desde este servidor
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
