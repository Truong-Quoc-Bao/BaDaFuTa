import { Router } from 'express';
import * as merchantController from './merchant.controller';

const router = Router();

// Route Đăng nhập riêng biệt cho Merchant
router.post('/login', merchantController.login);

export default router;
