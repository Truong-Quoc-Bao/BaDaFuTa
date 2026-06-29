import { Router } from 'express';
import { customerRoutes } from '../modules/customer';
import { merchantRoutes } from '../modules/merchant-store';
import { adminRouter } from '../modules/admin';

const router = Router();
router.use('/', customerRoutes);
router.use('/', merchantRoutes);
router.use('/', adminRouter);

export default router;
