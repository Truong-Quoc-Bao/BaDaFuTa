import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Button } from './ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMerchant } from '../contexts/MerchantContext';
import { toast } from 'sonner';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  Plus, 
  LogOut, 
  Home,
  BarChart3,
  PanelLeft
} from 'lucide-react';
import { cn } from './ui/utils';

const menuItems = [
  {
    title: "Tổng quan",
    icon: BarChart3,
    path: "/"
  },
  {
    title: "Quản lý đơn hàng",
    icon: ShoppingBag,
    path: "/merchant/orders"
  },
  {
    title: "Quản lý thực đơn",
    icon: MenuIcon,
    path: "/merchant/menu"
  },
  {
    title: "Nhóm topping",
    icon: Plus,
    path: "/merchant/toppings"
  }
];

export function MerchantLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { merchantAuth, logout } = useMerchant();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất thành công');
    navigate('/merchant/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out  h-screen sticky top-0",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Header */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 text-white" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-semibold text-gray-900">BaDaFuTa PartNer</h2>
                <p className="text-xs text-gray-600">Merchant Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                      isActive 
                        ? "bg-orange-100 text-orange-700 font-medium" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.title}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          {sidebarOpen && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900">
                {merchantAuth?.email || 'Merchant'}
              </p>
              <p className="text-xs text-gray-600">
                {merchantAuth?.restaurantName || 'Restaurant'}
              </p>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className={cn(
              "transition-all",
              sidebarOpen ? "w-full justify-start" : "w-10 h-10 p-0"
            )}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="ml-2 ">Đăng xuất</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {menuItems.find(item => item.path === location.pathname)?.title || 'Dashboard'}
              </h1>
              <p className="text-sm text-gray-600">
                Quản lý nhà hàng và đơn hàng của bạn
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 ">
          {/* {children} */}
          <Outlet /> {/* <-- Đây là nơi các route con sẽ hiển thị */}
        </main>
      </div>
    </div>
  );
}
