// import { Routes, Route, Navigate } from "react-router-dom";
// import { CartProvider } from "./contexts/CartContext";
// import { AuthProvider } from "./contexts/AuthContext";
// import { Header } from "./components/Header";
// import { Footer } from "./components/Footer.jsx"
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import HomePage from "./pages/HomePage";
// import { RestaurantPage } from "./pages/RestaurantPage";
// import MenuItemDetailPage from "./pages/MenuItemDetailPage";
// import CartPage from "./pages/CartPage";

// function App() {
//   return (
//     <AuthProvider>
//       <CartProvider>
//         {/* Header luôn hiện ở mọi trang */}
//         <Header />

//         <Routes>
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/restaurant/:id" element={<RestaurantPage />} />
//           <Route
//             path="/restaurant/:id/menu/:itemId"
//             element={<MenuItemDetailPage />}
//           />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>

//         <Footer />
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";

import { Header } from "./components/Header"; // <-- sửa lại import đúng cú pháp mặc định (nếu Header dùng export default)
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { RestaurantPage } from "./pages/RestaurantPage"; // <-- bỏ dấu ngoặc nhọn nếu export default
import MenuItemDetailPage from "./pages/MenuItemDetailPage";
import CartPage from "./pages/CartPage";
// import Test from "./pages/test"

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Header /> {/* luôn hiển thị trên mọi trang */}
        <Routes>
          {/* <Route path="/" element={<Test />} /> */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route
            path="/restaurant/:id/menu/:itemId"
            element={<MenuItemDetailPage />}
          />
          <Route path="/cart" element={<CartPage />} />
          {/* Nếu route không tồn tại, điều hướng về trang chủ */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

