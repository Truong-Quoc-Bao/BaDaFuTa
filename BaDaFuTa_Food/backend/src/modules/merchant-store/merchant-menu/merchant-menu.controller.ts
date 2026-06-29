import { Request, Response } from 'express';
import { merchantMenuService } from './merchant-menu.service';
import { AddMenuSchema, UpdateMenuSchema, ToggleMenuSchema } from './merchant-menu.validation';
import { z } from 'zod';

export const merchantMenuController = {
  // GET /api/merchant/menu?restaurantId=xxx
  async getMenu(req: Request, res: Response) {
    try {
      // 1. Lấy ID từ query (ưu tiên restaurantId, sau đó là merchant_id)
      const restaurantId = (req.query.restaurantId || req.query.merchant_id) as string;

      // 2. Kiểm tra xem có ID hay không
      if (!restaurantId || typeof restaurantId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'restaurantId không hợp lệ hoặc bị thiếu',
        });
      }

      // 3. Gọi service (Xóa kiểm tra .uuid() để chấp nhận cả "rest-1")
      const data = await merchantMenuService.getMenu(restaurantId);
      return res.json({ success: true, data });
    } catch (err: any) {
      console.error('Error in getMenu:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/merchant/menu
  async addMenu(req: Request, res: Response) {
    try {
      // Chuẩn hóa dữ liệu merchant_id từ FE gửi lên
      const payload = {
        ...req.body,
        merchant_id: req.body.merchant_id || req.body.user_id,
      };

      const validated = AddMenuSchema.parse(payload);
      const result = await merchantMenuService.addMenu(validated);

      return res.status(201).json({
        success: true,
        message: 'Thêm món ăn thành công',
        data: result,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.errors ? err.errors[0].message : err.message,
      });
    }
  },

  // PUT /api/merchant/menu/:id
  async updateMenu(req: Request, res: Response) {
    try {
      // Lấy id từ params theo đúng yêu cầu của bạn
      const id = req.params.id as string;

      if (!id) {
        return res.status(400).json({ success: false, message: 'ID món ăn là bắt buộc' });
      }

      const validated = UpdateMenuSchema.parse(req.body);
      const result = await merchantMenuService.updateMenu(id, validated);

      return res.json({
        success: true,
        message: 'Cập nhật thành công',
        data: result,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.errors ? err.errors[0].message : err.message,
      });
    }
  },

  // PUT /api/merchant/menu/:id/toggle
  async toggleMenu(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      if (!id) {
        return res.status(400).json({ success: false, message: 'ID món ăn là bắt buộc' });
      }

      const validated = ToggleMenuSchema.parse(req.body);
      const result = await merchantMenuService.toggleMenu(id, validated);

      return res.json({
        success: true,
        message: 'Cập nhật trạng thái thành công',
        data: result,
      });
    } catch (err: any) {
      return res.status(400).json({
        success: false,
        message: err.errors ? err.errors[0].message : err.message,
      });
    }
  },

  // DELETE /api/merchant/menu/:id
  async deleteMenu(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      if (!id) {
        return res.status(400).json({ success: false, message: 'ID món ăn là bắt buộc' });
      }

      await merchantMenuService.deleteMenu(id);
      return res.json({ success: true, message: 'Xóa món thành công' });
    } catch (err: any) {
      console.error('Error in deleteMenu:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Lỗi server khi xóa món',
      });
    }
  },
};

