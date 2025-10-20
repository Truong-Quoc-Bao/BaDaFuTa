// import { ShoppingCart, User, Package, LogOut, Settings } from "lucide-react";
// import { Logo } from "./Logo";
// import { Button } from "./ui/button";
// import { Badge } from "./ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avartar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "./ui/dropdown-menu";
// //import { LocationSelector } from "./LocationSelector";
// import { useCart } from "../contexts/CartContext";
// import { useAuth } from "../contexts/AuthContext";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function Header() {
//   return (
//     <header className="bg-white shadow-sm border-b-gray-100 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex item-center justify-between h-16">
//           {/* Logo và Nav*/}
//           <div className="flex items-center space-x-8">
//             <Button
//               variant="ouline"
//               onClick={() => navigate("/")}
//               className="flex items-center space-x-3 flex-shrink-0"
//             >
//               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
//                 <Logo size="md" />
//               </div>
//               <span className="text-xl font-bold text-red-900 tracking-wide">
//                 BaDaFuTa_Food
//               </span>
//             </Button>
//             {/* Nav  */}
//             <div className="hidden md:flex items-center space-x-6">
//               <Button variant="secondary" onClick={() => navigate("/")}>
//                 Giới thiệu
//               </Button>
//               <Button variant="secondary">Hỗ trợ</Button>
//             </div>
//           </div>

//           {/* Location */}
//           <div className="flex items-center space-x-4">
//             {/* Location Selector */}
//             <div className="hidden md:block">{/* <LocationSelector /> */}</div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate("/cart")}
//               className="relative"
//             >
//               <ShoppingCart className="w-4 h-4" />
//               {/* {totalItems > 0 && ( */}
//               <Badge
//                 variant="destructive"
//                 className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
//               >
//                 {/* {totalItems} */}
//               </Badge>
//               {/* )} */}
//             </Button>
//             {/* User Menu */}
//             {/* {authState.isAuthenticated && authState.user ? ( */}
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex items-center space-x-2"
//                   >
//                     <Avatar className="w-6 h-6">
//                       {/* <AvatarImage src={authState.user.avatar} /> */}
//                       <AvatarFallback className="text-xs">
//                         {/* {getInitials(authState.user.name)} */}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="hidden sm:inline">
//                       {/* {authState.user.name} */}
//                     </span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <div className="p-2">
//                     {/* <p className="font-medium">{authState.user.name}</p> */}
//                     <p className="text-sm text-gray-500">
//                       {/* {authState.user.email} */}
//                     </p>
//                     <Badge variant="secondary" className="text-xs mt-1">
//                       {/* {authState.user.role === "customer"
//                         ? "Khách hàng"
//                         : "Chủ cửa hàng"} */}
//                     </Badge>
//                   </div>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={() => navigate("/my-orders")}>
//                     <Package className="w-4 h-4 mr-2" />
//                     Đơn hàng của tôi
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => navigate("/profile")}>
//                     <User className="w-4 h-4 mr-2" />
//                     Thông tin cá nhân
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={() => navigate("/settings")}>
//                     <Settings className="w-4 h-4 mr-2" />
//                     Cài đặt
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem
//                     // onClick={handleLogout}
//                     className="text-red-600"
//                   >
//                     <LogOut className="w-4 h-4 mr-2" />
//                     Đăng xuất
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             {/* ) : ( */}
            
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => navigate("/login")}
//                 >
//                   <User className="w-4 h-4" />
//                   <span className="hidden sm:inline ml-2">Đăng nhập</span>
//                 </Button>
//                 <Button
//                   size="sm"
//                   onClick={() => navigate("/register")}
//                   className="bg-orange-500 hover:bg-orange-600 hidden sm:inline-flex"
//                 >
//                   Đăng ký
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => navigate("/merchant/login")}
//                   className="text-orange-600 border-orange-600 hover:bg-orange-50 hidden md:inline-flex"
//                 >
//                   Merchant
//                 </Button>
//               </div>
//             {/* )} */}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// }



import { useRef } from "react";

import { ShoppingCart, User, Package, LogOut, Settings } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avartar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
// import { LocationSelector } from "./LocationSelector";
import { useCart } from "../contexts/CartContext";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  // trong component Header:
  const cartIconRef = useRef(null);
  //lấy thoong tin
  const { state } = useCart();
  const { state: authState, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy user từ AuthContext
  const user = authState.user;

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // const { state } = useCart();
  // const { state: authState, logout } = useAuth();
  // const navigate = useNavigate();
  // const location = useLocation();

  // const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  // const handleLogout = () => {
  //   logout();
  //   navigate("/");
  // };

  // const getInitials = (name) => {
  //   return name
  //     .split(" ")
  //     .map((word) => word[0])
  //     .join("")
  //     .toUpperCase()
  //     .slice(0, 2);
  // };

  return (
    <header className="bg-white shadow-sm border border-gray-300 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Navigation */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-3 flex-shrink-0"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg border border-orange-200">
                <Logo size="md" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-wide">
                BADAFUTA
              </span>
            </button>

            {/* Navigation tabs next to logo */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => navigate("/about")}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/about"
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                Giới thiệu
              </button>
              <button
                onClick={() => navigate("/support")}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === "/support"
                    ? "text-orange-600"
                    : "text-gray-600 hover:text-orange-600"
                }`}
              >
                Hỗ trợ
              </button>
            </div>
          </div>

          {/* Location & Actions */}
          <div className="flex items-center space-x-4">
            {/* Location Selector */}
            <div className="hidden md:block">{/* <LocationSelector /> */}</div>
            {/* Cart */}
            <Button
              ref={cartIconRef}
              variant="outline"
              size="sm"
              onClick={() => navigate("/cart")}
              className="relative bg-white rounded-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex bg-red-500 items-center justify-center text-xs"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
            {/* User Menu */}
            {authState.isAuthenticated && authState.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center rounded-lg space-x-2"
                  >
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={authState.user.avatar} />
                      <AvatarFallback className="text-xs">
                        {getInitials(authState.user.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">
                      {authState.user.full_name}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="font-medium">{authState.user.full_name}</p>
                    <p className="text-sm text-gray-500">
                      {authState.user.email}
                    </p>
                    <Badge
                      variant="secondary"
                      className="text-xs mt-1 bg-gray-300"
                    >
                      {authState.user.role === "customer"
                        ? "Khách hàng"
                        : "Chủ cửa hàng"}
                    </Badge>
                  </div>
                  <DropdownMenuSeparator className="border-t border-gray-300 my-1" />{" "}
                  <DropdownMenuItem onClick={() => navigate("/my-orders")}>
                    <Package className="w-4 h-4 mr-2" />
                    Đơn hàng của tôi
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" />
                    Thông tin cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4 mr-2" />
                    Cài đặt
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="border-t border-gray-300 my-1" />{" "}
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2">Đăng nhập</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/register")}
                  className="bg-orange-500 hover:bg-orange-600 hidden w-[100px] sm:inline-flex"
                >
                  Đăng ký
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/merchantlogin")}
                  className="text-orange-600 border-orange-600 hover:bg-orange-50 hidden md:inline-flex"
                >
                  Merchant
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

