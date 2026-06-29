import { useState, useEffect } from 'react';
import { Users, Store, UserCheck, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://badafuta.onrender.com/api';

export default function DashboardPage() {
  const [statsData, setStatsData] = useState({
    totalCustomers: 0,
    totalPartners: 0,
    activePartners: 0,
    growthRate: '+0%',
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể tải thông số hệ thống');
      }

      const data = await response.json();
      setStatsData({
        totalCustomers: data.totalCustomers || 0,
        totalPartners: data.totalPartners || 0,
        activePartners: data.activePartners || 0,
        growthRate: data.growthRate || '+0%',
      });
      setActivities(data.recentActivities || []);
    } catch (error) {
      toast.error(error.message || 'Lỗi kết nối máy chủ khi lấy dữ liệu tổng quan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Tổng Khách Hàng (Users)',
      value: statsData.totalCustomers.toLocaleString(),
      icon: Users,
      color: 'text-orange-600 bg-orange-50 border-orange-100',
    },
    {
      title: 'Tổng Đối Tác (Partners)',
      value: statsData.totalPartners.toLocaleString(),
      icon: Store,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
    },
    {
      title: 'Đối Tác Hoạt Động',
      value: statsData.activePartners.toLocaleString(),
      icon: UserCheck,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Tăng trưởng tháng này',
      value: statsData.growthRate,
      icon: TrendingUp,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Chào mừng quay trở lại!
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Dưới đây là tổng quan tình trạng hoạt động thực tế của hệ thống BADAFUTA.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <p className="text-sm">Đang tải thông số vận hành...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={idx}
                  className="border border-slate-100 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2.5 rounded-xl border ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-extrabold text-slate-900">{stat.value}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-2 border border-slate-100 bg-white rounded-2xl shadow-sm">
              <CardHeader className="border-b border-slate-50 pb-4">
                <CardTitle className="text-base font-bold text-slate-800">
                  Hoạt động hệ thống gần đây
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {activities.length > 0 ? (
                    activities.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0 last:pb-0"
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{item.text}</p>
                          <span className="text-xs text-slate-400">{item.time}</span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.role === 'customer'
                              ? 'bg-orange-50 text-orange-600 border border-orange-100'
                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}
                        >
                          {item.role === 'customer' ? 'Khách hàng' : 'Đối tác'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-6">
                      Chưa ghi nhận hoạt động nào gần đây.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg text-white flex flex-col justify-between p-6">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white backdrop-blur-sm border border-white/10">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">Vận hành Đối tác</h3>
                  <p className="text-xs text-white/80 mt-1 leading-relaxed">
                    Tạo mới, phê duyệt hoặc đình chỉ hoạt động của các gian hàng trên hệ thống
                    BADAFUTA Food nhanh chóng.
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <Link
                  to="/add-partner"
                  className="flex items-center justify-between w-full px-4 py-3 bg-white text-orange-600 rounded-xl text-sm font-bold hover:bg-orange-50 transition-all shadow-md"
                >
                  <span>Thêm Đối Tác Mới</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/users"
                  className="flex items-center justify-center w-full py-3 bg-white/10 text-white border border-white/20 rounded-xl text-sm font-bold hover:bg-white/20 transition-all"
                >
                  Quản Lý Người Dùng
                </Link>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
