// src/modules/users/user.controller.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as userService from './user.service';
import {
  RegisterSchema,
  LoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  ChangePasswordSchema,
} from './user.validation';
import { ah } from '../../../utils/async-handler';

export const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error, value } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email } = value;
    await userService.forgotPassword(email);

    return res.status(200).json({
      success: true,
      message: 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Đã xảy ra lỗi hệ thống.',
    });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { token, password } = value;
    await userService.resetPassword(token, password);

    return res.status(200).json({
      success: true,
      message: 'Mật khẩu đã được thay đổi thành công.',
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Đã xảy ra lỗi hệ thống.',
    });
  }
};
//

export const register = async (req: Request, res: Response) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const user = await userService.register(data);
    res.status(201).json({ success: true, data: user });
  } catch (e: any) {
    const code = e.code || (e.errors ? 'VALIDATION_ERROR' : 'AUTH_UNKNOWN');
    const status =
      code === 'AUTH_EMAIL_EXISTS' || code === 'AUTH_PHONE_EXISTS'
        ? 409
        : code === 'VALIDATION_ERROR'
        ? 400
        : 500;
    res.status(status).json({
      success: false,
      error_code: code,
      error: e.message || 'Đăng ký thất bại',
      issues: e.errors,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const data = LoginSchema.parse(req.body);
    const user = await userService.login(data);
    // TODO: phát JWT nếu cần
    res.json({ success: true, user, token: 'token_here' });
  } catch (e: any) {
    const code = e.code || (e.errors ? 'VALIDATION_ERROR' : 'AUTH_UNKNOWN');
    const status =
      code === 'AUTH_USER_NOT_FOUND'
        ? 404
        : code === 'AUTH_WRONG_PASSWORD'
        ? 401
        : code === 'VALIDATION_ERROR'
        ? 400
        : 500;
    res.status(status).json({
      success: false,
      error_code: code,
      error: e.message || 'Đăng nhập thất bại',
      issues: e.errors,
    });
  }
};

export const loginGoogle: RequestHandler = ah(async (req, res) => {
  const { token } = req.body;

  // Gọi sang Service xử lý
  const result = await userService.loginGoogle(token);

  res.status(200).json({
    success: true,
    user: result.user,
    token: result.token,
  });
});

// Thêm import RequestHandler ở đầu file nếu chưa có và thêm hàm này vào user.controller.ts:
export const loginFacebook: RequestHandler = ah(async (req, res) => {
  const { token } = req.body;
  const result = await userService.loginFacebook(token);

  res.status(200).json({
    success: true,
    user: result.user,
    token: result.token,
  });
});

// Thêm vào cuối file src/modules/users/user.controller.ts

export const getProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id; // Lấy từ authMiddleware đã xác thực JWT
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Yêu cầu xác thực tài khoản!' });
    }

    const user = await userService.getProfile(userId);
    return res.status(200).json({ success: true, user });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message || 'Đã xảy ra lỗi hệ thống.',
    });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Yêu cầu xác thực tài khoản!' });
    }

    // Xác thực dữ liệu đầu vào bằng Zod Schema
    const validatedData = updateProfileSchema.parse(req.body);

    // Gọi sang service thực hiện cập nhật
    const updatedUser = await userService.updateProfile(userId, validatedData);

    return res.status(200).json({
      success: true,
      message: 'Cập nhật hồ sơ thành công!',
      user: updatedUser,
    });
  } catch (e: any) {
    const code = e.code || (e.errors ? 'VALIDATION_ERROR' : 'AUTH_UNKNOWN');
    const status = code === 'VALIDATION_ERROR' ? 400 : 500;
    return res.status(status).json({
      success: false,
      error_code: code,
      error: e.message || 'Cập nhật hồ sơ thất bại.',
      issues: e.errors,
    });
  }
};

// đổi mk
export const changePassword = async (req: Request, res: Response): Promise<any> => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Yêu cầu xác thực tài khoản!' });
    }

    // Xác thực dữ liệu đầu vào bằng Zod
    const { oldPassword, newPassword } = ChangePasswordSchema.parse(req.body);

    // Gọi service thực hiện đổi mật khẩu
    await userService.changePassword(userId, oldPassword, newPassword);

    return res.status(200).json({
      success: true,
      message: 'Đổi mật khẩu thành công!',
    });
  } catch (e: any) {
    const isValError = e.errors ? true : false;
    return res.status(isValError ? 400 : 500).json({
      success: false,
      message: e.message || 'Đổi mật khẩu thất bại.',
      issues: e.errors,
    });
  }
};
