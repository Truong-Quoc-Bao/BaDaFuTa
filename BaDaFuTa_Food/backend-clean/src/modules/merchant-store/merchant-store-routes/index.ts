import { Router } from 'express';
import { dashBoard } from '../merchant-dashboard';
import { order } from '../order';
import { login } from '../merchant';

const router = Router();

router.use('/merchant', dashBoard);
router.use('/merchant', order);
router.use('/merchant', login);

export default router;
