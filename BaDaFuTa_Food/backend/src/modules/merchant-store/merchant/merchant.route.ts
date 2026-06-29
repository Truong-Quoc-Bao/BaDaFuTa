import { Router } from 'express';
import * as merchantController from './merchant.controller';

const router = Router();
router.post('/login', merchantController.login);
router.post('/register', merchantController.register);
export default router;
