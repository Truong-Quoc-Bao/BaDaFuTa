// src/services/api.js

const BASE_URL = '/apiLocal'; // Sử dụng proxy cấu hình trong vite.config.js

// Hàm bổ trợ gửi request kèm Token Admin
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('admin_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${url}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Yêu cầu xử lý thất bại');
  }
  return data;
};

export const AdminAPI = {
  // 1. Đăng nhập Admin
  // Bạn hãy kiểm tra trong file `customer/users` xem endpoint đăng nhập thực tế của bạn là gì nhé!
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/customer/users/login`, {
      // hoặc /customer/login
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Đăng nhập thất bại');
    return data;
  },

  // 2. Lấy số liệu thống kê Dashboard
  getDashboardStats: async () => {
    // Gọi tới API tổng hợp số liệu
    return fetchWithAuth('/customer/dashboard-stats');
  },

  // 3. Lấy danh sách Người dùng (Gồm Customer và cả Merchant)
  getUsers: async () => {
    // Thường backend cũ sẽ lấy danh sách ở customer/users
    return fetchWithAuth('/customer/users');
  },

  // 4. Lấy danh sách tất cả Đối tác (Nhà hàng)
  getPartners: async () => {
    // Có thể lấy từ merchant-store hoặc customer/merchant
    return fetchWithAuth('/merchant-store/merchant');
  },

  // 5. Admin tạo mới tài khoản Đối tác (Partner)
  createPartner: async (partnerData) => {
    return fetchWithAuth('/merchant-store/merchant', {
      method: 'POST',
      body: JSON.stringify({
        restaurant_name: partnerData.restaurantName,
        owner_name: partnerData.ownerName,
        email: partnerData.email,
        password: partnerData.password,
        phone: partnerData.phone,
        address: partnerData.address,
      }),
    });
  },
};
