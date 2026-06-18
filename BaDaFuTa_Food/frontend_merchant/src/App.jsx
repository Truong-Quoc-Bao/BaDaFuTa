import { Routes, Route, Navigate } from 'react-router-dom';
import { MerchantLayout } from './components/MerchantLayout';
import MerchantLoginPage from './pages/MerchantLoginPage';
import { MerchantOverviewPage } from './pages/MerchantOverviewPage';
import { MerchantProvider, useMerchant } from './contexts/MerchantContext';
import { MerchantOrderManagementPage } from './pages/MerchantOrderManagementPage';
import { MerchantMenuManagementPage } from './pages/MerchantMenuManagementPage';
import { ToppingGroupManagementPage } from './pages/ToppingGroupManagementPage';

// Component bảo vệ route: chặn truy cập trái phép khi chưa đăng nhập [1]
function ProtectedMerchantRoute({ children }) {
  const { merchantAuth } = useMerchant();

  // Nếu chưa đăng nhập (không có user_id), chuyển hướng ngay về trang login [1]
  if (!merchantAuth?.user_id) {
    return <Navigate to="/merchant/login" replace />;
  }
  return children;
}

function App() {
  return (
    <MerchantProvider>
      <Routes>
        {/* Trang đăng nhập công khai */}
        <Route path="merchant/login" element={<MerchantLoginPage />} />

        {/* Layout dùng chung và toàn bộ trang con được bảo vệ bởi Guard [1] */}
        <Route
          path="/"
          element={
            <ProtectedMerchantRoute>
              <MerchantLayout />
            </ProtectedMerchantRoute>
          }
        >
          <Route index element={<MerchantOverviewPage />} />
          <Route path="merchant/dashboard" element={<MerchantOverviewPage />} />
          <Route path="merchant/orders" element={<MerchantOrderManagementPage />} />
          <Route path="merchant/menu" element={<MerchantMenuManagementPage />} />
          <Route path="merchant/toppings" element={<ToppingGroupManagementPage />} />
        </Route>

        {/* Chuyển hướng các đường dẫn không hợp lệ về trang login để bảo mật [1] */}
        <Route path="*" element={<Navigate to="/merchant/login" replace />} />
      </Routes>
    </MerchantProvider>
  );
}

export default App;
