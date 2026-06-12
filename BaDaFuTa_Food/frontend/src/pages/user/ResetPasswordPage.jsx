import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Lấy mã token từ đường link URL xuống (ví dụ: ?token=abcxyz)
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(false);

    if (!token) {
      setError('Liên kết không hợp lệ hoặc thiếu mã xác thực (token)!');
      return;
    }

    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu mới!');
      document.getElementById('password').focus();
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu mới phải có tối thiểu 6 ký tự!');
      document.getElementById('password').focus();
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      document.getElementById('confirmPassword').focus();
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API cập nhật mật khẩu mới ở Backend (bỏ /users theo cấu hình router của bạn)
      const res = await fetch('https://badafuta.onrender.com/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Đặt lại mật khẩu thất bại! Vui lòng thử lại.');
      } else {
        setSuccessMessage('Đặt lại mật khẩu thành công! Bạn sẽ được chuyển về trang đăng nhập.');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          navigate('/login');
        }, 3000); // Tự động chuyển về trang đăng nhập sau 3 giây
      }
    } catch (err) {
      setError('Không thể kết nối đến máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="hover:scale-100">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                  <Logo size="lg" className="text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Đặt lại mật khẩu</CardTitle>
              <CardDescription className="text-center">
                Thiết lập mật khẩu mới cho tài khoản BADAFUTA của bạn.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <CardContent className="space-y-4">
                  {/* Hiển thị thông báo Lỗi hoặc Thành công */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium">
                      {error}
                    </div>
                  )}
                  {successMessage && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center font-medium">
                      {successMessage}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu mới</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu mới từ 6 ký tự"
                        className="pl-10 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading || !!successMessage}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={!!successMessage}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới"
                        className="pl-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading || !!successMessage}
                      />
                    </div>
                  </div>

                  <Button
                    variant="default"
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={isLoading || !!successMessage}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang cập nhật mật khẩu...
                      </>
                    ) : (
                      'Xác nhận thay đổi'
                    )}
                  </Button>
                </CardContent>
              </div>
            </form>

            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              <div className="text-center text-sm text-gray-600">
                Quay lại trang{' '}
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
                >
                  Đăng nhập.
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}