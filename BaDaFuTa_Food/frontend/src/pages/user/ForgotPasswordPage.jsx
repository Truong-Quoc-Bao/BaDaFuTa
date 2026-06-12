import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!email.trim()) {
      setError('Vui lòng nhập địa chỉ email!');
      setIsLoading(false);
      return;
    }

    // Kiểm tra định dạng email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmail) {
      setError('Email không đúng định dạng!');
      setIsLoading(false);
      return;
    }

    try {
      // Gọi API yêu cầu đặt lại mật khẩu ở Backend
      const res = await fetch('https://badafuta.onrender.com/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Gửi yêu cầu thất bại! Vui lòng thử lại.');
      } else {
        setSuccessMessage(
          'Hệ thống đã gửi liên kết đặt lại mật khẩu! Vui lòng kiểm tra hòm thư email của bạn.'
        );
        setEmail('');
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
          <Button
            variant="ghost"
            onClick={() => navigate('/login')}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại đăng nhập
          </Button>

          <Card className="hover:scale-100">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                  <Logo size="lg" className="text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Quên mật khẩu</CardTitle>
              <CardDescription className="text-center">
                Nhập email đăng ký tài khoản BADAFUTA của bạn để nhận hướng dẫn đặt lại mật khẩu.
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <CardContent className="space-y-4">
                  {/* Khối hiển thị thông báo Lỗi hoặc Thành công */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm text-center font-medium animate-pulse">
                      {error}
                    </div>
                  )}
                  {successMessage && (
                    <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm text-center font-medium">
                      {successMessage}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Địa chỉ Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Nhập email của bạn (Ví dụ: abc@gmail.com)"
                        className={`pl-10 ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button
                    variant="default"
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang gửi yêu cầu...
                      </>
                    ) : (
                      'Gửi yêu cầu đặt lại mật khẩu'
                    )}
                  </Button>
                </CardContent>
              </div>
            </form>

            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              <div className="text-center text-sm text-gray-600">
                Nhớ ra mật khẩu?{' '}
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
                >
                  Đăng nhập tại đây.
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}