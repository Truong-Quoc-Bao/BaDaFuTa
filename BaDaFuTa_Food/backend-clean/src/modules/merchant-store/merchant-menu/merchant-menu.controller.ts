import { Request, Response } from 'express';
import { merchantMenuService } from './merchant-menu.service';
import { AddMenuSchema, UpdateMenuSchema, ToggleMenuSchema } from './merchant-menu.validation';

export const merchantMenuController = {
  // GET /api/merchant/menu?restaurantId=xxx
  async getMenu(req: Request, res: Response) {
    try {
      const merchantId = (req.query.restaurantId || req.query.merchant_id) as string;

      if (!merchantId) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu restaurantId',
        });
      }

      const data = await merchantMenuService.getMenu(merchantId);
      res.json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /api/merchant/menu
  async addMenu(req: Request, res: Response) {
    try {
      const validated = AddMenuSchema.parse({
        ...req.body,
        // Hỗ trợ cả merchant_id lẫn user_id từ FE gửi lên
        merchant_id: req.body.merchant_id || req.body.user_id,
      });

      const result = await merchantMenuService.addMenu(validated);

      res.status(201).json({
        success: true,
        message: 'Thêm món ăn thành công',
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        // Zod trả về mảng errors, lấy message đầu tiên
        message: err.errors ? err.errors[0].message : err.message,
      });
    }
  },

  // PUT /api/merchant/menu/:id
  async updateMenu(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      // Dùng UpdateMenuSchema riêng thay vì AddMenuSchema.partial()
      // để tránh lỗi type inference khi có .transform()
      const validated = UpdateMenuSchema.parse(req.body);

      const result = await merchantMenuService.updateMenu(id, validated);

      res.json({
        success: true,
        message: 'Cập nhật thành công',
        data: result,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.errors ? err.errors[0].message : err.message,
      });
    }
  },

  // PUT /api/merchant/menu/:id/toggle
  async toggleMenu(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const validated = ToggleMenuSchema.parse(req.body);

      const result = await merchantMenuService.toggleMenu(id, validated);

      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.errors ? err.errors[0].message : err.message,
      });
    }
  },

  // DELETE /api/merchant/menu/:id
  async deleteMenu(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      await merchantMenuService.deleteMenu(id);

      res.json({ success: true, message: 'Xóa món thành công' });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.errors ? err.errors[0].message : err.message,
      });
    }
  },
};
