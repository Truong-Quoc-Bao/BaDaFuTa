import { Navigate, Outlet } from 'react-router-dom';
import { useMerchant } from '../contexts/MerchantContext'; // Sửa lại đường dẫn import cho đúng

export function MerchantProtectedRoute() {
  const { merchantAuth } = useMerchant();

  // Nếu chưa đăng nhập (không có user_id), chặn lại và đẩy về trang đăng nhập [1]
  if (!merchantAuth?.user_id) {
    return <Navigate to="/merchant/login" replace />;
  }

  // Nếu đã đăng nhập, cho phép đi tiếp vào các trang quản trị bên trong [1]
  return <Outlet />;
}