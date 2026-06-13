// src/modules/users/user.route.ts
import { Router } from 'express';
import * as userController from './user.controller';

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

export default router;
