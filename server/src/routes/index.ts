import { Router } from "express";
import apiRoutes from './api/index.js'


const router = Router();


//Añadir authenticateToken cuando se haya creado 
    //Algo asi
     // router.use('/api', authenticateToken,  apiRoutes);
router.use('/api', apiRoutes)

export default router;