import { Router } from 'express';
import { AdminController } from './admin.controller';

const router = Router();
const adminController = new AdminController();

// Định nghĩa các luồng URL có tiền tố /admin ở trong route con
router.post('/admin/login', adminController.login);
router.get('/admin/dashboard-stats', adminController.getDashboardStats);
router.post('/admin/add-partner', adminController.addPartner);

// 🔴 BỔ SUNG THÊM 2 DÒNG ROUTE CÒN THIẾU TẠI ĐÂY:
router.get('/admin/users', adminController.getUsers);
router.get('/admin/partners', adminController.getPartners);

// Thêm 2 route này vào cuối file của bạn trước dòng export default router:
router.put('/admin/partners/:id', adminController.updatePartner);
router.delete('/admin/partners/:id', adminController.deletePartner);

export default router;
