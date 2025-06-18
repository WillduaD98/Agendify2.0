import { Router } from "express";
// import apiRoutes from './api/index.js'
import type{ Request, Response} from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();


//Añadir authenticateToken cuando se haya creado 
    //Algo asi
     // router.use('/api', authenticateToken,  apiRoutes);
// router.use('/api', apiRoutes)
router.use((_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html'))
})

export default router;