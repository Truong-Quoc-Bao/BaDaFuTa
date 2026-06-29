export class AdminValidation {
    static validateLogin(body: any): void {
      if (!body.email || !body.password) {
        throw new Error('Email và mật khẩu không được bỏ trống');
      }
    }
  
    static validateCreatePartner(body: any): void {
      const requiredFields = ['restaurantName', 'ownerName', 'email', 'password', 'phone', 'address'];
      for (const field of requiredFields) {
        if (!body[field]) {
          throw new Error(`Trường thông tin '${field}' là bắt buộc`);
        }
      }
    }
  }