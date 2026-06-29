import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Store, User, Mail, Lock, Phone, MapPin } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/apiLocal';

export default function AdminAddMerchantPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { restaurantName, ownerName, email, password, phone, address } = formData;

    if (!restaurantName || !ownerName || !email || !password || !phone || !address) {
      toast.error('Vui lòng điền đầy đủ các thông tin bắt buộc');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');

      const response = await fetch(`${API_BASE_URL}/admin/add-partner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurant_name: restaurantName,
          owner_name: ownerName,
          email: email,
          password: password,
          phone: phone,
          address: address,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Không thể khởi tạo tài khoản đối tác');
      }

      toast.success('Kích hoạt & Tạo tài khoản đối tác thành công!');
      navigate('/partners');
    } catch (error) {
      toast.error(error.message || 'Lỗi lưu thông tin tài khoản đối tác lên máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto text-left">
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-50 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Tạo tài khoản Đối tác (Partner)</CardTitle>
              <CardDescription>
                Cung cấp các thông tin thiết lập ban đầu giúp nhà hàng có thể đăng nhập vào BADAFUTA
                Partner.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Restaurant Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b border-gray-50 pb-2">
                  Thông tin nhà hàng
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="restaurantName">
                    Tên Nhà Hàng/Cửa Hàng <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="restaurantName"
                      name="restaurantName"
                      placeholder="Ví dụ: Bún Chả Sinh Từ"
                      value={formData.restaurantName}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Số Điện Thoại <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="Ví dụ: 0912345678"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">
                    Địa Chỉ Hoạt Động <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      name="address"
                      placeholder="Số nhà, tên đường, quận/huyện..."
                      value={formData.address}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 border-b border-gray-50 pb-2">
                  Thông tin chủ sở hữu & Tài khoản
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="ownerName">
                    Tên Chủ Quán <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="ownerName"
                      name="ownerName"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={formData.ownerName}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email Tài Khoản <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="partner@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Mật Khẩu Mặc Định <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Nhập mật khẩu cho đối tác"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/partners')}
                className="text-gray-500 hover:text-gray-800"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-2 px-6 font-semibold"
              >
                {loading ? 'Đang kích hoạt...' : 'Kích hoạt & Tạo tài khoản'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
