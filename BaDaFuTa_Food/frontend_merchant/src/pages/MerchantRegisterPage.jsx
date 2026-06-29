import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Logo } from '../components/Logo';
import { toast } from 'sonner';
import { MapPin, Store, Lock, Mail, User, Phone, CreditCard, Image, ArrowLeft } from 'lucide-react';

const API_BASE_URL = 'https://badafuta.onrender.com/api';

export default function MerchantRegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    password: '',
    phone: '',
    cccd: '',
    image: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { restaurantName, ownerName, email, password, phone, cccd, image, address } = formData;

    if (
      !restaurantName ||
      !ownerName ||
      !email ||
      !password ||
      !phone ||
      !cccd ||
      !image ||
      !address
    ) {
      toast.error('Vui lòng nhập đầy đủ toàn bộ thông tin đăng ký');
      return;
    }

    setLoading(true);
    try {
      // Gửi yêu cầu POST đăng ký lên Backend
      const response = await fetch(`${API_BASE_URL}/merchant-store/merchant/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra khi gửi yêu cầu đăng ký');
      }

      toast.success('Gửi yêu cầu đăng ký gian hàng thành công! Đang chờ duyệt.');
      navigate('/merchant/login');
    } catch (error) {
      toast.error(error.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-lg text-left">
        <Button
          variant="ghost"
          onClick={() => navigate('/merchant/login')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại Đăng nhập
        </Button>

        {/* Logo */}
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">BADAFUTA Partner</h1>
          <p className="text-gray-600 mt-2">Đăng ký trở thành đối tác nhà hàng của chúng tôi</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle className="text-xl">Đăng ký Đối tác mới</CardTitle>
            <CardDescription>Cung cấp đầy đủ thông tin cửa hàng của bạn</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* Tên nhà hàng */}
              <div className="space-y-2">
                <Label htmlFor="restaurantName">Tên Nhà Hàng/Cửa Hàng *</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="restaurantName"
                    name="restaurantName"
                    placeholder="Ví dụ: Phở Gia Truyền"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tên chủ sở hữu */}
              <div className="space-y-2">
                <Label htmlFor="ownerName">Họ và tên Chủ Quán *</Label>
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

              {/* CCCD */}
              <div className="space-y-2">
                <Label htmlFor="cccd">Số Căn Cước Công Dân (CCCD) *</Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="cccd"
                    name="cccd"
                    placeholder="Nhập 12 số CCCD của bạn"
                    value={formData.cccd}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* SĐT */}
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại liên hệ *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Nhập số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email đăng ký tài khoản *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="merchant@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Mật khẩu mong muốn */}
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu tài khoản mong muốn *</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ nhà hàng *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    name="address"
                    placeholder="Nhập địa chỉ chi tiết nhà hàng"
                    value={formData.address}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* URL hình ảnh cửa hàng */}
              <div className="space-y-2">
                <Label htmlFor="image">Đường dẫn hình ảnh cửa hàng *</Label>
                <div className="relative">
                  <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="image"
                    name="image"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.image}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  variant="default"
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                >
                  {loading ? 'Đang gửi yêu cầu...' : 'Đăng ký cửa hàng'}
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Separator />
              <p className="text-sm pt-4 text-gray-600">
                Bạn đã có tài khoản đối tác?{' '}
                <Link
                  to="/merchant/login"
                  className="text-orange-600 hover:text-orange-700 hover:underline font-bold"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
