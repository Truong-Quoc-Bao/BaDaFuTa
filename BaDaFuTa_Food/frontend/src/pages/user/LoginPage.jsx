import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Separator } from '../../components/ui/separator';
import { Eye, EyeOff, Loader2, User, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  // usestate
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { state, dispatch } = useAuth(); // <-- lấy state từ AuthContext

  useEffect(() => {
    if (state.isAuthenticated) {
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  const location = useLocation();
  const phoneFromVerification = location.state?.phone || '';
  const emailFromVerification = location.state?.email || '';

  // // 🔹 Dán useEffect kiểm tra login ở đây
  // useEffect(() => {
  //   if (state.isAuthenticated) {
  //     navigate("/", { replace: true }); // nếu đã login, redirect luôn
  //   }
  // }, [state.isAuthenticated, navigate]);

  // ✅ Hàm cập nhật input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (location.state?.email) {
      setIdentifier(location.state.email);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // ✅ Kiểm tra bỏ trống trước
    if (!identifier.trim()) {
      setError('Vui lòng nhập email hoặc số điện thoại!');
      document.getElementById('email').focus();
      setIsLoading(false);
      return;
    }
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu!');
      document.getElementById('password').focus();
      setIsLoading(false);
      return;
    }

    try {
      // const res = await fetch('https://badafuta-production.up.railway.app/api/login', {
      const res = await fetch('https://badafuta.onrender.com/api/login', {
        method: 'POST',
        credentials: 'include', // ✅ gửi cookie
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      // if (!res.ok) {
      //   console.log(data);
      //   const errMsg = (data.error || '').toLowerCase();

      //   if (
      //     errMsg.includes('not found') ||
      //     errMsg.includes('không tồn tại') ||
      //     errMsg.includes('email') ||
      //     errMsg.includes('phone')
      //   ) {
      //     setError('Email hoặc số điện thoại không tồn tại!');
      //     document.getElementById('email').focus();
      //   } else if (errMsg.includes('wrong password') || errMsg.includes('mật khẩu')) {
      //     setError('Mật khẩu không chính xác!');
      //     document.getElementById('password').focus();
      //   } else {
      //     setError('Đăng nhập thất bại! Vui lòng thử lại.');
      //   }
      // }
      if (!res.ok) {
        console.log('Lỗi từ server:', data);

        let errMsg = 'Đăng nhập thất bại! Vui lòng thử lại.';

        try {
          const parsed = JSON.parse(data.error);
          if (Array.isArray(parsed) && parsed[0]?.message) {
            errMsg = parsed[0].message;
          }
        } catch (_) {
          if (data.error) errMsg = data.error;
        }

        // Kiểm tra theo error_code trước
        if (data.error_code === 'AUTH_USER_NOT_FOUND') {
          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
          const isPhone = /^\d{9,12}$/.test(identifier);

          if (isEmail) setError('Email không tồn tại hoặc chưa đăng ký!');
          else if (/^\d+$/.test(identifier) && !isPhone) setError('Số điện thoại không hợp lệ!');
          else if (isPhone) setError('Số điện thoại không tồn tại hoặc chưa đăng ký!');
          else setError('Tài khoản không tồn tại!');

          document.getElementById('email').focus();
          return;
        }

        if (data.error_code === 'AUTH_WRONG_PASSWORD') {
          setError('Mật khẩu không chính xác!');
          document.getElementById('password').focus();
          return;
        }

        // Fallback: check message từ server
        const lower = errMsg.toLowerCase();
        if (lower.includes('email')) {
          setError('Email không đúng định dạng!');
          document.getElementById('email').focus();
          return;
        }
        if (lower.includes('số điện thoại') || lower.includes('identifier')) {
          setError('Số điện thoại không đúng định dạng!');
          document.getElementById('email').focus();
          return;
        }
        if (lower.includes('mật khẩu') || lower.includes('wrong password')) {
          setError('Mật khẩu không chính xác!');
          document.getElementById('password').focus();
          return;
        }

        setError(errMsg);
      } else {
        //cách này lưu vào context nên là ko gây load trang mượt hơn
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        dispatch({ type: 'LOGIN_SUCCESS', payload: data.user }); // cập nhật context

        const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath, { replace: true }); // chuyển sang theo yêu cầu
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
            onClick={() => navigate('/')}
            className="mb-6 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>

          <Card className="hover:scale-100">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                {/* <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-7 h-7 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                  </svg>
                </div> */}
                <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                  <Logo size="lg" className="text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Đăng nhập</CardTitle>
              <CardDescription className="text-center">
                Đăng nhập vào tài khoản BADAFUTA của bạn
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 ">
                <CardContent className="space-y-4">
                  {/* {error && (
                      <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                      </Alert>
                  )} */}

                  {/* <div className="space-y-2">
                                    <Label htmlFor="unfid">UNFID</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                        id="unfid"
                                        type="text"
                                        placeholder="Nhập UNFID của bạn"
                                        value={unfid}
                                        onChange={(e) => setUnfid(e.target.value)}
                                        className="pl-10"
                                        disabled={isLoading}
                                        />
                                    </div>
                                    </div> */}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email/Số điện thoại</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="text"
                        placeholder="Nhập Email/Số điện thoại của bạn"
                        //
                        className={`pl-10 ${
                          error.includes('Email') || error.includes('điện thoại')
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }`}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        // disabled={isLoading}
                        disabled={!!emailFromVerification || isLoading}
                        autoFocus={error.includes('Email')}
                      />
                    </div>
                    {error.includes('Email') || error.includes('điện thoại') ? (
                      <p className="text-red-500 text-sm">{error}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu"
                        className={`pl-10 pr-10 ${
                          error.toLowerCase().includes('mật khẩu') ||
                          error.toLowerCase().includes('password')
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : ''
                        }`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        autoFocus={error.toLowerCase().includes('mật khẩu')}
                        //
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {error.toLowerCase().includes('mật khẩu') ||
                    error.toLowerCase().includes('password') ? (
                      <p className="text-red-500 text-sm">{error}</p>
                    ) : null}
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
                        Đang đăng nhập...
                      </>
                    ) : (
                      'Đăng nhập'
                    )}
                    {/* Đăng nhập */}
                  </Button>
                  <div className="flex justify-end">
                    <Link
                      to="/forgotpass"
                      className="text-orange-600 text-sm hover:text-orange-700 hover:underline  "
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <div className="my-2">
                    {/* Separator với chữ "Hoặc" */}
                    <div className="flex items-center gap-4 mb-4">
                      <Separator className="flex-1" />
                      <span className="text-gray-500">Hoặc</span>
                      <Separator className="flex-1" />
                    </div>

                    {/* Nút đăng nhập Google và Facebook cùng hàng */}
                    {/* <div className="flex gap-4">
                      <Button
                        variant="outline"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
                          alt="Google"
                          className="w-5 h-5"
                        />
                        Google
                      </Button>

                      <Button variant="outline" className="flex-1 flex items-center justify-center">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/667px-2023_Facebook_icon.svg.png"
                          alt="Facebook"
                          className="w-5 h-5"
                        />
                        Facebook
                      </Button>
                    </div> */}

                    {/* Nút đăng nhập Google mới đã được cấu hình và Facebook cùng hàng */}
                    <div className="flex gap-4">
                      <div className="flex-grow flex justify-center">
                        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                          <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                              const idToken = credentialResponse.credential;
                              setIsLoading(true);
                              setError('');
                              try {
                                const res = await fetch(
                                  'https://badafuta.onrender.com/api/login-google',
                                  {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ token: idToken }),
                                  },
                                );

                                const data = await res.json();

                                if (res.ok) {
                                  localStorage.setItem('token', data.token);
                                  localStorage.setItem('user', JSON.stringify(data.user));
                                  dispatch({ type: 'LOGIN_SUCCESS', payload: data.user }); // Cập nhật context

                                  const redirectPath =
                                    localStorage.getItem('redirectAfterLogin') || '/';
                                  localStorage.removeItem('redirectAfterLogin');
                                  navigate(redirectPath, { replace: true });
                                } else {
                                  setError(data.message || 'Đăng nhập bằng Google thất bại.');
                                }
                              } catch (err) {
                                setError('Không thể kết nối đến máy chủ.');
                              } finally {
                                if (document.getElementById('email')) {
                                  setIsLoading(false);
                                }
                              }
                            }}
                            onError={() => {
                              setError('Đăng nhập bằng Google thất bại!');
                            }}
                            text="signin_with"
                            shape="rectangular"
                            locale="vi"
                          />
                        </GoogleOAuthProvider>
                      </div>

                      {/* <Button
                        variant="outline"
                        className="flex-grow flex items-center justify-center"
                      >
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/667px-2023_Facebook_icon.svg.png"
                          alt="Facebook"
                          className="w-5 h-5 mr-2"
                        />
                        Facebook
                      </Button> */}

                      {/* Nút đăng nhập Facebook tự động gọi API */}
                      <FacebookLogin
                        appId={import.meta.env.VITE_FACEBOOK_APP_ID}
                        onSuccess={async (response) => {
                          const accessToken = response.accessToken;
                          setIsLoading(true);
                          setError('');
                          try {
                            const res = await fetch(
                              'https://badafuta.onrender.com/api/login-facebook',
                              {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ token: accessToken }),
                              },
                            );

                            const data = await res.json();
                            if (res.ok) {
                              localStorage.setItem('token', data.token);
                              localStorage.setItem('user', JSON.stringify(data.user));
                              dispatch({ type: 'LOGIN_SUCCESS', payload: data.user }); // Cập nhật context

                              const redirectPath =
                                localStorage.getItem('redirectAfterLogin') || '/';
                              localStorage.removeItem('redirectAfterLogin');
                              navigate(redirectPath, { replace: true });
                            } else {
                              setError(data.message || 'Đăng nhập bằng Facebook thất bại.');
                            }
                          } catch (err) {
                            setError('Không thể kết nối đến máy chủ.');
                          } finally {
                            setIsLoading(false);
                          }
                        }}
                        onFail={() => {
                          setError('Đăng nhập bằng Facebook thất bại!');
                        }}
                        render={({ onClick }) => (
                          <Button
                            variant="outline"
                            className="flex-1 flex items-center justify-center"
                            onClick={onClick}
                          >
                            <img
                              src="data:image/png;base64,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"
                              alt="Facebook"
                              className="w-5 h-5 mr-2"
                            />
                            Facebook
                          </Button>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </div>
            </form>

            <CardFooter className="">
              <Separator />
              <div className="text-center text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link
                  to="/phone-otp"
                  // to="/register"
                  className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
                >
                  Đăng ký ngay.
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
