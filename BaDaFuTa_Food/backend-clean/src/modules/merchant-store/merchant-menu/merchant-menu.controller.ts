import { Request, Response } from 'express';
import { merchantMenuService } from './merchant-menu.service';
import { AddMenuSchema, UpdateMenuSchema, ToggleMenuSchema } from './merchant-menu.validation';
import { z } from 'zod';

export const merchantMenuController = {
  // GET /api/merchant/menu?restaurantId=xxx
  async getMenu(req: Request, res: Response) {
    try {
      // Lấy restaurantId từ query string
      const restaurantId = (req.query.restaurantId || req.query.merchant_id) as string;

      // Kiểm tra UUID hợp lệ (Ví dụ: 14cdec77-6ece-429b-a952-44bce7c96eda)
      if (!restaurantId || !z.string().uuid().safeParse(restaurantId).success) {
        return res.status(400).json({
          success: false,
          message: 'restaurantId không hợp lệ (phải là định dạng UUID)',
        });
      }

      const data = await merchantMenuService.getMenu(restaurantId);
      return res.json({ success: true, data });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/merchant/menu
  async addMenu(req: Request, res: Response) {
    try {
      const validated = AddMenuSchema.parse({
        ...req.body,
        merchant_id: req.body.merchant_id || req.body.user_id,
      });

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
      // Lấy id từ params theo cách bạn muốn
      const id = req.params.id as string;

      // Kiểm tra id có phải UUID không trước khi xử lý
      if (!z.string().uuid().safeParse(id).success) {
        return res.status(400).json({ success: false, message: 'ID món ăn không hợp lệ' });
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

      if (!z.string().uuid().safeParse(id).success) {
        return res.status(400).json({ success: false, message: 'ID món ăn không hợp lệ' });
      }

      const validated = ToggleMenuSchema.parse(req.body);
      const result = await merchantMenuService.toggleMenu(id, validated);

      return res.json({ success: true, data: result });
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

      if (!z.string().uuid().safeParse(id).success) {
        return res.status(400).json({ success: false, message: 'ID món ăn không hợp lệ' });
      }

      await merchantMenuService.deleteMenu(id);
      return res.json({ success: true, message: 'Xóa món thành công' });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
};
