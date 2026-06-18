import { Routes, Route } from 'react-router-dom';
import MerchantLoginPage from './pages/MerchantLoginPage'; // Sửa đường dẫn nếu cần
import { MerchantProtectedRoute } from './components/MerchantProtectedRoute'; // Import Route Guard mới tạo [1]
import { MerchantOverviewPage } from './pages/MerchantOverviewPage';
import { MerchantOrderManagementPage } from './pages/MerchantOrderManagementPage';
import { MerchantMenuManagementPage } from './pages/MerchantMenuManagementPage';

function App() {
  return (
    <Routes>
      {/* 1. Các route công khai, ai cũng có thể vào */}
      <Route path="/merchant/login" element={<MerchantLoginPage />} />

      {/* 2. Nhóm các route BẮT BUỘC phải đăng nhập mới cho phép truy cập [1] */}
      <Route element={<MerchantProtectedRoute />}>
        <Route path="/merchant/dashboard" element={<MerchantOverviewPage />} />
        <Route path="/merchant/orders" element={<MerchantOrderManagementPage />} />
        <Route path="/merchant/menu" element={<MerchantMenuManagementPage />} />
      </Route>
    </Routes>
  );
}
