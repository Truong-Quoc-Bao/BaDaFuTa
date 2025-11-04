import { Routes, Route } from "react-router-dom";
import { MerchantLayout } from "./components/MerchantLayout";
import MerchantLoginPage from "./pages/MerchantLoginPage";
import { MerchantOverviewPage } from "./pages/MerchantOverviewPage";
import { MerchantProvider } from "./contexts/MerchantContext";
import { MerchantOrderManagementPage } from "./pages/MerchantOrderManagementPage";
import { MerchantMenuManagementPage } from "./pages/MerchantMenuManagementPage";
import { ToppingGroupManagementPage } from "./pages/ToppingGroupManagementPage"

function App() {
  return (
    <MerchantProvider>
      <Routes>
        {/* Trang đăng nhập riêng biệt */}
        <Route path="/login" element={<MerchantLoginPage />} />

        {/* Layout dùng chung */}
        <Route path="/" element={<MerchantLayout />}>
          <Route index element={<MerchantOverviewPage />} /> 
          <Route path="/merchant/dashboard" element={<MerchantOverviewPage />} /> 
          <Route path="/merchant/orders" element={<MerchantOrderManagementPage/>}/>
          <Route path="/merchant/menu" element={<MerchantMenuManagementPage/>}/>
          <Route path="/merchant/toppings" element={<ToppingGroupManagementPage/>}/>
        </Route>
      </Routes>
    </MerchantProvider>
  );
}

export default App;
