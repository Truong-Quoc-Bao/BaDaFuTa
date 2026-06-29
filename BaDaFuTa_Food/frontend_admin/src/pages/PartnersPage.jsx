import { useState, useEffect } from 'react';
import { Search, Store, UserPlus, Phone, MapPin, Loader2 } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://badafuta.onrender.com/api';

export default function PartnersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPartners = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/partners`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể kết nối danh sách đối tác');
      }

      const data = await response.json();
      setPartners(data.partners || []);
    } catch (error) {
      toast.error(error.message || 'Lỗi kết nối máy chủ khi lấy danh sách đối tác');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const filteredPartners = partners.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.owner?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm đối tác, chủ quán..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          onClick={() => navigate('/add-partner')}
          className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 rounded-xl py-2 px-4 shadow-sm font-semibold"
        >
          <UserPlus className="w-4 h-4" />
          Thêm đối tác mới
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
          <p className="text-sm">Đang tải danh sách nhà hàng...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPartners.map((partner) => (
            <Card key={partner.id} className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-base">{partner.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Chủ sở hữu: {partner.owner}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      partner.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {partner.status === 'Active' ? 'Đang hoạt động' : 'Chờ duyệt'}
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-gray-50 pt-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{partner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{partner.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredPartners.length === 0 && (
            <p className="text-center col-span-2 text-gray-400 py-10">
              Chưa tìm thấy đối tác nào phù hợp.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
