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

// // export default App;

// import { Routes, Route, Navigate } from "react-router-dom";
// import { CartProvider } from "./contexts/CartContext";
// import { AuthProvider } from "./contexts/AuthContext";

// import { Header } from "./components/Header"; 
// import {Footer } from "./components/Footer"
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import HomePage from "./pages/HomePage";
// import { RestaurantPage } from "./pages/RestaurantPage"; // <-- bỏ dấu ngoặc nhọn nếu export default
// import MenuItemDetailPage from "./pages/MenuItemDetailPage";
// import CartPage from "./pages/CartPage";
// // import Test from "./pages/test"

// function App() {
//   // Ẩn Header/Footer nếu ở trang login hoặc register
//   const hideHeaderFooter = ["/login", "/register"].includes(location.pathname);

//   return (
//     <AuthProvider>
//       <CartProvider>
//         {!hideHeaderFooter && <Header />}
//         <Routes>
//           {/* <Route path="/" element={<Test />} /> */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
//           <Route path="/restaurant/:id" element={<RestaurantPage />} />
//           <Route
//             path="/restaurant/:id/menu/:itemId"
//             element={<MenuItemDetailPage />}
//           />
//           <Route path="/cart" element={<CartPage />} />
//           {/* Nếu route không tồn tại, điều hướng về trang chủ */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//         {!hideHeaderFooter && <Footer />}
//       </CartProvider>
//     </AuthProvider>
//   );
// }

// export default App;

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import MerchantLogin from "./pages/MerchantLoginPage"
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { RestaurantPage } from "./pages/RestaurantPage";
import MenuItemDetailPage from "./pages/MenuItemDetailPage";
import CartPage from "./pages/CartPage";
import CheckOutPage from "./pages/CheckOutPage"

function App() {
  const location = useLocation(); // ✅ lấy location hiện tại
  const hideHeaderFooter = ["/login", "/register", "/merchantlogin"].includes(location.pathname);

  return (
    <AuthProvider>
      <CartProvider>
        {!hideHeaderFooter && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/merchantlogin" element={<MerchantLogin />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route
            path="/restaurant/:id/menu/:itemId"
            element={<MenuItemDetailPage />}
          />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart/checkout" element={<CheckOutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {!hideHeaderFooter && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
