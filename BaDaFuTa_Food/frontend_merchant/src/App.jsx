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
        <Route path="merchant/login" element={<MerchantLoginPage />} />

        {/* Layout dùng chung */}
        <Route path="/" element={<MerchantLayout />}>
          <Route index element={<MerchantOverviewPage />} /> 
          <Route path="merchant/dashboard" element={<MerchantOverviewPage />} /> 
          <Route path="merchant/orders" element={<MerchantOrderManagementPage/>}/>
          <Route path="merchant/menu" element={<MerchantMenuManagementPage/>}/>
          <Route path="merchant/toppings" element={<ToppingGroupManagementPage/>}/>
        </Route>
      </Routes>
    </MerchantProvider>
  );
}

export default App;



// // App.jsx
// import { Routes, Route, Navigate } from "react-router-dom";
// import { MerchantLayout } from "./components/MerchantLayout";
// import MerchantLoginPage from "./pages/MerchantLoginPage";
// import { MerchantOverviewPage } from "./pages/MerchantOverviewPage";
// import { MerchantProvider, useMerchant } from "./contexts/MerchantContext";
// import { MerchantOrderManagementPage } from "./pages/MerchantOrderManagementPage";
// import { MerchantMenuManagementPage } from "./pages/MerchantMenuManagementPage";
// import { ToppingGroupManagementPage } from "./pages/ToppingGroupManagementPage";

// // Component bảo vệ route cho merchant đã login
// function ProtectedMerchantRoute({ children }) {
//   const { merchantAuth } = useMerchant();
//   if (!merchantAuth) return <Navigate to="/merchant/login" replace />;
//   return children;
// }

// function App() {
//   return (
//     <MerchantProvider>
//       <Routes>
//         {/* Trang đăng nhập riêng */}
//         <Route path="/merchant/login" element={<MerchantLoginPage />} />

//         {/* Layout dùng chung */}
//         <Route path="/merchant" element={<ProtectedMerchantRoute><MerchantLayout /></ProtectedMerchantRoute>}>
//           <Route index element={<MerchantOverviewPage />} />
//           <Route path="dashboard" element={<MerchantOverviewPage />} />
//           <Route path="orders" element={<MerchantOrderManagementPage />} />
//           <Route path="menu" element={<MerchantMenuManagementPage />} />
//           <Route path="toppings" element={<ToppingGroupManagementPage />} />
//         </Route>

//         {/* Redirect nếu path không hợp lệ */}
//         <Route path="*" element={<Navigate to="/merchant/login" replace />} />
//       </Routes>
//     </MerchantProvider>
//   );
// }

// export default App;
