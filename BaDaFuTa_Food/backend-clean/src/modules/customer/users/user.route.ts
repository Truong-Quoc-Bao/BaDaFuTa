// src/modules/users/user.route.ts
import { Router } from 'express';
import * as userController from './user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/register', userController.register);
router.post('/login', userController.login);

// Đăng ký thêm route này vào user.route.ts
router.post('/login-google', userController.loginGoogle);
// Đăng ký thêm route này vào user.route.ts
router.post('/login-facebook', userController.loginFacebook);

// Đường dẫn yêu cầu gửi mail quên mật khẩu
router.post('/forgot-password', userController.forgotPassword);

// Đường dẫn xác nhận mật khẩu mới
router.post('/reset-password', userController.resetPassword);

// Thêm vào src/modules/users/user.route.ts

// ⚠️ Bạn nhớ import Middleware xác thực JWT của dự án bạn vào đây (ví dụ: import { authMiddleware } from '...')
// router.get('/profile', authMiddleware, userController.getProfile);
// router.put('/update', authMiddleware, userController.updateProfile);

// Bản demo tham khảo:
router.get('/profile', authMiddleware as any, userController.getProfile as any);
router.put('/update', authMiddleware as any, userController.updateProfile as any);
export default router;
