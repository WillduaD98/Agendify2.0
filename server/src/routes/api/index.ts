import { Router } from 'express';
import { clientRouter } from './client.routes.js';
import { userRouter } from './user.routes.js';
import { appointmentRouter } from './appointment.routes.js';
import authRoutes from '../auth.routes.js'; // 👈 Importar auth
import { verifyToken } from '../../utils/authMiddleware.js';
const router = Router();

router.use('/clients', verifyToken, clientRouter);
router.use('/users',verifyToken, userRouter);
router.use('/appointments', verifyToken, appointmentRouter);
router.use('/', authRoutes);
export default router;