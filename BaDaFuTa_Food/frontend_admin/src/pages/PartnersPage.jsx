import { useState, useEffect } from 'react';
import {
  Search,
  Store,
  UserPlus,
  Phone,
  MapPin,
  Loader2,
  Edit,
  Trash2,
  X,
  Save,
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../components/ui/alert-dialog';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/apiLocal';

export default function PartnersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [partners, setPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form states để chỉnh sửa
  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
  });

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
      toast.error(error.message || 'Lỗi lấy danh sách đối tác');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Mở modal sửa thông tin đối tác
  const openEditDialog = (partner) => {
    setSelectedItem(partner);
    setFormData({
      restaurantName: partner.name,
      ownerName: partner.owner,
      email: partner.email || '',
      phone: partner.phone || '',
      address: partner.address || '',
    });
    setShowEditDialog(true);
  };

  // ===========================================
  // 🔹 API Cập nhật thông tin Đối tác
  // ===========================================
  const handleEditPartner = async () => {
    if (!formData.restaurantName || !formData.ownerName || !formData.phone || !formData.address) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/partners/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể cập nhật đối tác');
      }

      toast.success('Cập nhật thông tin đối tác thành công!');
      setShowEditDialog(false);
      setSelectedItem(null);
      fetchPartners(); // Load lại danh sách mới
    } catch (error) {
      toast.error(error.message || 'Lỗi cập nhật đối tác');
    }
  };

  // ===========================================
  // 🔹 API Xóa Đối tác
  // ===========================================
  const handleDeletePartner = async (partnerId) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/admin/partners/${partnerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể xóa đối tác');
      }

      toast.success('Xóa đối tác thành công!');
      fetchPartners();
    } catch (error) {
      toast.error(error.message || 'Có lỗi xảy ra khi xóa đối tác');
    }
  };

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
          className="bg-orange-600 w-[180px] md:w-[260px] hover:bg-orange-700 text-white flex items-center gap-2 rounded-xl py-2 px-4 shadow-sm font-semibold"
        >
          <Store className="w-4 h-4" />
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
            <Card
              key={partner.id}
              className="border border-slate-100 shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
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
                </div>

                {/* 🔴 NÚT XÓA / SỬA */}
                <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(partner)}
                    className="text-slate-600 hover:text-slate-900"
                  >
                    <Edit className="w-4 h-4 mr-1.5" />
                    Sửa
                  </Button>
                  <AlertDialog>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-100"
                    >
                      <Trash2 className="w-4 h-4 mr-1.5" />
                      <AlertDialogTrigger>Xóa</AlertDialogTrigger>
                    </Button>
                    <AlertDialogContent className="text-left">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Hành động này sẽ xóa hoàn toàn tài khoản đối tác "{partner.name}" cùng với
                          hồ sơ chủ quán liên kết khỏi cơ sở dữ liệu và không thể khôi phục lại.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePartner(partner.id)}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          Xác nhận xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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

      {/* 🔴 MODAL CHỈNH SỬA THÔNG TIN ĐỐI TÁC */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto text-left">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin đối tác</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cửa hàng và chủ sở hữu đối tác trên hệ thống BADAFUTA.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="restaurantName">Tên nhà hàng *</Label>
                <Input
                  id="restaurantName"
                  value={formData.restaurantName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, restaurantName: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="ownerName">Tên chủ quán *</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, ownerName: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email liên hệ *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Địa chỉ hoạt động *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-slate-50 pt-4">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              <X className="w-4 h-4 mr-1.5" />
              Hủy
            </Button>
            <Button
              onClick={handleEditPartner}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Save className="w-4 h-4 mr-1.5" />
              Lưu thay đổi
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
