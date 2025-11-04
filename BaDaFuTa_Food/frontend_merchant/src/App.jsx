import { Routes, Route } from "react-router-dom";
import { MerchantLayout } from "./components/MerchantLayout";
import MerchantLoginPage from "./pages/MerchantLoginPage";
import { MerchantOverviewPage } from "./pages/MerchantOverviewPage";
import { MerchantProvider } from "./contexts/MerchantContext";

function App() {
  return (
    <MerchantProvider>
      <Routes>
        {/* Trang đăng nhập riêng biệt */}
        <Route path="/login" element={<MerchantLoginPage />} />

        {/* Layout dùng chung */}
        <Route path="/" element={<MerchantLayout />}>
          <Route index element={<MerchantOverviewPage />} /> {/* / */}
          <Route path="dashboard" element={<MerchantOverviewPage />} /> {/* /dashboard */}
        </Route>
      </Routes>
    </MerchantProvider>
  );
}

export default App;
