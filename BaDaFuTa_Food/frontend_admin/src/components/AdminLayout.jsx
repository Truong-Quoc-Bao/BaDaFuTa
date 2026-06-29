import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Store, UserPlus, LogOut, Shield } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/users', label: 'Quản lý Người dùng', icon: Users },
    { path: '/partners', label: 'Danh sách Đối tác', icon: Store },
    { path: '/add-partner', label: 'Thêm Đối tác', icon: UserPlus },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50 text-slate-800">
      {/* Sidebar - Thanh bên trắng tinh tế */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between fixed h-full z-10 shadow-sm">
        <div>
          {/* Logo Brand BADAFUTA */}
          <div className="p-6 flex items-center gap-3 border-b border-slate-100">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-base tracking-wide leading-tight">
                BADAFUTA
              </h2>
              <span className="text-xs text-orange-600 font-bold tracking-wider uppercase">
                Hệ thống Admin
              </span>
            </div>
          </div>

          {/* Danh mục menu */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/15'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Nút Đăng xuất ở dưới góc trái */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Khu vực nội dung chính */}
      <main className="flex-1 flex flex-col min-h-screen pl-64">
        {/* Header trên cùng */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-20 shadow-sm shadow-slate-100/40">
          <h1 className="text-base font-bold text-slate-800">
            {menuItems.find((item) => item.path === location.pathname)?.label || 'Quản trị viên'}
          </h1>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="block text-sm font-bold text-slate-800">Trần Quốc Bảo</span>
              <span className="block text-[11px] font-medium text-slate-400">Admin tối cao</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shadow-inner">
              AD
            </div>
          </div>
        </header>

        {/* Nội dung trang con */}
        <div className="flex-1 p-8 bg-slate-50/60">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
