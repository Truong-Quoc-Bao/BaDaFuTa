import { Router } from 'express';
import { dashBoard } from '../merchant-dashboard';
import { order } from '../order';
import { login } from '../merchant';
import { merchantMenuRoutes } from '../merchant-menu';

const router = Router();

router.use('/merchant', dashBoard);
router.use('/merchant', order);
router.use('/merchant', login);
router.use('/merchant', merchantMenuRoutes);

export default router;
