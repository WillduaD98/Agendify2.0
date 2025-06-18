// import router from './routes/index.js';
import express from 'express';
import dotenv from 'dotenv';
// import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// import sequelize from './config/db.js';


//import new Apollo and typeDefs placeholders
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import {typeDefs, resolvers} from './schemas/index.js';
import { Request, Response } from 'express';
import { authenticateToken } from './services/auth.js';
import db from './config/db.js'
dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
});

console.log('🔎 typeDefs:', typeDefs);
console.log('🔎 resolvers:', resolvers);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startApolloServer = async () => {
  await server.start();
  await db();

  const app = express();
  const PORT = process.env.PORT || 3001;
  
  app.use(express.json()); // ✅ Primero, obligatorio
  
  // Apollo middleware — NUNCA DEBE FALTAR
  app.use('/graphql', expressMiddleware(server, { context: authenticateToken }));
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../../client/dist')))

      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
      })
    }

    app.listen(PORT, () => {
      console.log(`API server runnin on port ${PORT}!`)
      console.log(`Use GraphQl at http://localhost:${PORT}/graphql`);
    });
};
console.log('🚧 NODE_ENV:', process.env.NODE_ENV);

startApolloServer();