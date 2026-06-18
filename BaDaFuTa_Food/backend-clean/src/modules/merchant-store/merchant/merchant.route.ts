import { Router } from 'express';
import * as merchantController from './merchant.controller';

const router = Router();
router.post('/login', merchantController.login);
export default router;
