import { Router } from 'express';
import * as merchantController from './merchant.controller'; // Import controller của merchant

const router = Router();

// Đường dẫn thực tế sẽ là: /api/merchant/login
router.post('/login', merchantController.login);
// router.post('/overview', merchantController.getOverview);

export default router;
