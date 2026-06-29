import { Router } from 'express';
import { AdminController } from './admin.controller';

const router = Router();
const adminController = new AdminController();

// Đưa thẳng tiền tố /admin vào từng đường dẫn con để tránh trùng lặp URL đăng nhập
router.post('/admin/login', adminController.login);
router.get('/admin/dashboard-stats', adminController.getDashboardStats);
router.post('/admin/add-partner', adminController.addPartner);

export default router;
