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
import { Lock, Eye, EyeOff, Loader2, XCircle } from 'lucide-react';
import { cn } from '../../components/ui/utils'; // Import thêm hàm cn để xử lý màu viền động

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // State quản lý lỗi mật khẩu yếu/mạnh và xác nhận mật khẩu giống RegisterPage
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigate = useNavigate();

  // Lấy mã token từ đường link URL xuống (ví dụ: ?token=abcxyz)
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  // Hàm xử lý đổi mật khẩu và đo độ mạnh yếu động
  const handlePasswordChange = (value) => {
    setPassword(value);
    if (error) setError('');

    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasSpecial = /[!@#$%^&*()_\-+=\[\]{};:"',.<>/?\\|]/.test(value);

    if (!value) {
      setPasswordError('');
    } else if (value.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
    } else {
      if (!hasLetter) {
        setPasswordError('Mật khẩu phải chứa ít nhất 1 chữ cái.');
      } else {
        let score = 0;
        if (hasUppercase) score++;
        if (hasNumber) score++;
        if (hasSpecial) score++;

        if (score === 0) {
          setPasswordError('Mật khẩu yếu');
        } else if (score === 1) {
          setPasswordError('Mật khẩu trung bình');
        } else if (score === 2) {
          setPasswordError('Mật khẩu khá');
        } else {
          setPasswordError('Mật khẩu mạnh - tốt');
        }
      }
    }

    // Kiểm tra lại độ khớp của mật khẩu xác nhận khi mật khẩu chính thay đổi
    if (confirmPassword) {
      if (confirmPassword !== value) {
        setConfirmPasswordError('⚠️ Mật khẩu xác nhận không khớp');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  // Hàm xử lý khi thay đổi mật khẩu nhập lại
  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (error) setError('');

    if (!password) {
      setConfirmPasswordError('⚠️ Vui lòng nhập mật khẩu trước');
    } else if (value !== password) {
      setConfirmPasswordError('⚠️ Mật khẩu xác nhận không khớp');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!token) {
      setError('Liên kết không hợp lệ hoặc thiếu mã xác thực (token)!');
      return;
    }

    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu mới!');
      document.getElementById('password')?.focus();
      return;
    }

    // Ngăn chặn submit nếu mật khẩu chính không đạt yêu cầu
    if (
      passwordError &&
      (passwordError.includes('ít nhất') || passwordError.includes('chứa ít nhất'))
    ) {
      setError('Mật khẩu mới chưa đạt yêu cầu bảo mật tối thiểu!');
      document.getElementById('password')?.focus();
      return;
    }

    if (!confirmPassword.trim()) {
      setError('Vui lòng nhập mật khẩu xác nhận!');
      document.getElementById('confirmPassword')?.focus();
      return;
    }

    if (confirmPasswordError) {
      setError('Mật khẩu xác nhận chưa chính xác!');
      document.getElementById('confirmPassword')?.focus();
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

  //
  //
  // 🔹 CHÈN ĐOẠN NÀY NGAY TRƯỚC HÀM RETURN CHÍNH CỦA COMPONENT:
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-red-200">
            <CardHeader className="space-y-1 text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                  <XCircle className="w-12 h-12 text-red-500" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center text-red-600">
                Liên kết không hợp lệ
              </CardTitle>
              <CardDescription className="text-center text-gray-500">
                Đường dẫn đặt lại mật khẩu này không hợp lệ hoặc thiếu mã xác thực. Vui lòng yêu cầu
                liên kết mới.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="default"
                onClick={() => navigate('/forgotpass')}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Yêu cầu liên kết khôi phục mới
              </Button>
            </CardContent>
            <CardFooter className="justify-center">
              <Link to="/login" className="text-sm text-gray-600 hover:underline">
                Quay lại trang Đăng nhập
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  //
  //
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

                  {/* Input Mật khẩu mới */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu mới *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu mới từ 6 ký tự"
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        disabled={isLoading || !!successMessage}
                        className={cn(
                          'pl-10 pr-10',
                          !password && error?.includes('mật khẩu mới')
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : passwordError
                            ? passwordError.includes('ít nhất') ||
                              passwordError.includes('chứa ít nhất')
                              ? 'border-red-500 hover:border-red-500 focus-visible:ring-red-500'
                              : passwordError === 'Mật khẩu yếu'
                              ? 'border-red-500 hover:border-red-500 focus-visible:ring-red-500'
                              : passwordError === 'Mật khẩu trung bình'
                              ? 'border-yellow-500 hover:border-yellow-500 focus-visible:ring-yellow-500'
                              : passwordError === 'Mật khẩu khá'
                              ? 'border-yellow-300 hover:border-yellow-300 focus-visible:ring-yellow-300'
                              : passwordError === 'Mật khẩu mạnh - tốt'
                              ? 'border-green-500 hover:border-green-500 focus-visible:ring-green-500'
                              : 'border-gray-300 focus-visible:ring-orange-500'
                            : '',
                        )}
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
                    {passwordError && (
                      <p
                        className={cn(
                          'text-xs text-left transition-colors duration-200',
                          passwordError.includes('ít nhất') ||
                            passwordError.includes('chứa ít nhất')
                            ? 'text-red-500'
                            : passwordError === 'Mật khẩu yếu'
                            ? 'text-red-500'
                            : passwordError === 'Mật khẩu trung bình'
                            ? 'text-yellow-500'
                            : passwordError === 'Mật khẩu khá'
                            ? 'text-yellow-300'
                            : passwordError === 'Mật khẩu mạnh - tốt'
                            ? 'text-green-500'
                            : 'text-red-500',
                        )}
                      >
                        {passwordError}
                      </p>
                    )}
                  </div>

                  {/* Input Xác nhận mật khẩu mới */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        disabled={isLoading || !!successMessage}
                        className={cn(
                          'pl-10 pr-10',
                          !confirmPassword && error?.includes('xác nhận')
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : confirmPasswordError
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : confirmPassword && !confirmPasswordError
                            ? 'border-green-500 focus-visible:ring-green-500'
                            : '',
                        )}
                      />
                    </div>
                    {confirmPasswordError && (
                      <p className="text-xs text-red-500 text-left">{confirmPasswordError}</p>
                    )}
                    {!confirmPasswordError && confirmPassword && password === confirmPassword && (
                      <p className="text-xs text-green-500 text-left">✅ Mật khẩu khớp</p>
                    )}
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
