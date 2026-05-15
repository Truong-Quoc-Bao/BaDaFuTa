// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Loader2, Phone, ArrowLeft, Check, XCircle, ShieldCheck } from 'lucide-react';

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '../../components/ui/card';
// import { Button } from '../../components/ui/button';
// import { Input } from '../../components/ui/input';
// import { Label } from '../../components/ui/label';
// import { Separator } from '../../components/ui/separator';
// import { cn } from '../../components/ui/utils';
// import { Logo } from '../../components/Logo';
// import { useAuth } from '../../contexts/AuthContext';
// export default function PhoneVerification() {
//   const navigate = useNavigate();
//   const { state } = useAuth();

//   useEffect(() => {
//     if (state.isAuthenticated) {
//       const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
//       localStorage.removeItem('redirectAfterLogin');
//       navigate(redirectPath, { replace: true });
//     }
//   }, [state.isAuthenticated, navigate]);

//   const [phone, setPhone] = useState('');
//   const [phoneError, setPhoneError] = useState('');
//   const [otp, setOtp] = useState('');
//   const [otpSent, setOtpSent] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [countdown, setCountdown] = useState(0);
//   const [otpError, setOtpError] = useState('');
//   const [otpMessage, setOtpMessage] = useState('');
//   const phoneRef = useRef(null); // 👈 thêm ref

//   // const hosts = ['https://badafuta-production.up.railway.app/api'];
//   const hosts = ['https://badafuta.onrender.com/api'];
//   const fetchWithTimeout = (url, options, timeout = 5000) => {
//     return Promise.race([
//       fetch(url, options),
//       new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
//     ]);
//   };

//   const tryHosts = async (path, payload) => {
//     const promises = hosts.map((host) =>
//       fetchWithTimeout(
//         `${host}${path}`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         },
//         5000,
//       )
//         .then((res) => {
//           if (!res.ok) throw new Error(`Server ${host} trả lỗi`);
//           return res.json().then((data) => ({ data, host }));
//         })
//         .catch((err) => {
//           console.warn(err.message);
//           return Promise.reject();
//         }),
//     );

//     return Promise.any(promises); // trả về host thành công đầu tiên
//   };

//   const handleChange = (value) => {
//     setPhone(value);
//     const phoneRegex = /^0\d{9}$/;

//     if (!value) setPhoneError('');
//     else if (!value.startsWith('0')) setPhoneError('Số điện thoại phải bắt đầu bằng 0');
//     else if (value.length > 10) setPhoneError('Số điện thoại không được quá 10 số');
//     else if (!phoneRegex.test(value)) setPhoneError('Số điện thoại phải có đúng 10 chữ số');
//     else setPhoneError('');
//   };

//   const startCountdown = () => setCountdown(60);

//   // Đếm ngược
//   useEffect(() => {
//     if (countdown <= 0) return;
//     const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     const normalizedPhone = phone.trim();

//     // ✅ Fix: set phoneError thay vì otpError
//     if (!normalizedPhone || phoneError || normalizedPhone.length !== 10) {
//       setPhoneError('Vui lòng nhập số điện thoại hợp lệ!'); // 👈 đây
//       phoneRef.current?.focus(); // 🔴 focus input
//       return;
//     }

//     setLoading(true);
//     setPhoneError(''); // clear lỗi trước khi gửi
//     setOtpError('');
//     setOtpMessage('');

//     try {
//       // const res = await fetch("/api192/otp/send", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify({ phone: normalizedPhone }),
//       // });

//       const { data, host } = await tryHosts('/otp/send', {
//         phone: normalizedPhone,
//       });

//       if (data.success) {
//         setOtpSent(true);
//         setOtpMessage(`Đã gửi mã OTP thành công đến số điện thoại ${phone}!`);
//         startCountdown();
//       } else {
//         setOtpError(data.message || 'Không thể gửi OTP!');
//       }
//     } catch (err) {
//       console.error('Lỗi fetch:', err);
//       setOtpError('Không thể kết nối server!');
//       phoneRef.current?.focus(); // 👈 focus nếu lỗi mạng
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!otp.trim()) {
//       setOtpError('Vui lòng nhập mã OTP!');
//       return;
//     }

//     setLoading(true);
//     setOtpError('');
//     setOtpMessage('');

//     try {
//       // const res = await fetch("/api192/otp/verify", {
//       //   method: "POST",
//       //   headers: { "Content-Type": "application/json" },
//       //   body: JSON.stringify({ phone, otp }),
//       // });

//       const { data } = await tryHosts('/otp/verify', { phone, otp });

//       if (data.success) {
//         setOtpError('');
//         setOtpMessage('Xác minh thành công!');
//         setTimeout(() => navigate('/register', { state: { phone } }), 500);
//       } else {
//         setOtpError(data.message || 'OTP không đúng!');
//       }
//     } catch (err) {
//       console.error('Lỗi fetch:', err);
//       setOtpError('Không thể kết nối server!');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <Button
//           variant="ghost"
//           onClick={() => navigate('/login')}
//           className="mb-6 text-gray-600 hover:text-gray-900"
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại đăng nhập
//         </Button>

//         <Card className="hover:scale-100">
//           <CardHeader className="space-y-1">
//             <div className="flex items-center justify-center mb-4">
//               <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
//                 <Logo size="lg" className="text-white" />
//               </div>
//             </div>
//             <CardTitle className="text-2xl text-center">Xác minh số điện thoại</CardTitle>
//             <CardDescription className="text-center">
//               Vui lòng xác nhận số điện thoại để tiếp tục đăng ký tài khoản
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-4">
//             {/* Phone input */}
//             <div className="space-y-2">
//               <Label htmlFor="phone">Số điện thoại *</Label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                 <Input
//                   id="phone"
//                   type="tel"
//                   placeholder="Nhập số điện thoại (VD: 0987...)"
//                   value={phone}
//                   onChange={(e) => handleChange(e.target.value)}
//                   ref={phoneRef} // 👈 gắn ref
//                   disabled={otpSent}
//                   className={cn(
//                     'pl-10 pr-10',
//                     phoneError
//                       ? 'border-red-500 hover:border-red-500 focus:border-red-500'
//                       : phone.length === 10
//                       ? 'border-green-500 hover:border-green-500 focus:border-green-500'
//                       : 'border-gray-300',
//                   )}
//                 />
//                 {phoneError && (
//                   <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
//                 )}
//                 {!phoneError && phone.length === 10 && (
//                   <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
//                 )}
//               </div>
//               {phoneError && <p className="text-xs text-red-500 text-left">{phoneError}</p>}
//             </div>

//             {/* OTP input */}
//             {/* OTP input */}
//             {otpSent && (
//               <div className="space-y-2">
//                 <Label htmlFor="otp">Mã OTP</Label>
//                 <div className="relative">
//                   <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                   <Input
//                     id="otp"
//                     type="text"
//                     placeholder="Nhập mã OTP"
//                     value={otp}
//                     onChange={(e) => {
//                       setOtp(e.target.value);
//                       setOtpError('');
//                     }}
//                     className={cn(
//                       'pl-10 pr-10',
//                       otpError
//                         ? 'border-red-500 hover:border-red-500 focus:border-red-500'
//                         : otp.length > 0
//                         ? 'border-green-500 hover:border-green-500 focus:border-green-500'
//                         : 'border-gray-300',
//                     )}
//                   />
//                   {otpError && (
//                     <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
//                   )}
//                 </div>

//                 {/* Hiển thị thông báo OTP */}
//                 {otpError && <p className="text-xs text-red-500">{otpError}</p>}
//                 {otpMessage && !otpError && <p className="text-xs text-green-500">{otpMessage}</p>}

//                 {countdown > 0 && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     Bạn có thể gửi lại OTP sau {countdown}s
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* Button */}
//             {!otpSent ? (
//               <Button
//                 onClick={handleSendOtp}
//                 className="w-full bg-orange-500 hover:bg-orange-600"
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang gửi OTP...
//                   </>
//                 ) : (
//                   'Gửi OTP'
//                 )}
//               </Button>
//             ) : (
//               <Button
//                 onClick={countdown === 0 ? handleSendOtp : handleVerifyOtp}
//                 className={`w-full ${
//                   countdown === 0
//                     ? 'bg-orange-500 hover:bg-orange-600'
//                     : 'bg-green-600 hover:bg-green-700'
//                 }`}
//                 disabled={loading}
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     {countdown === 0 ? 'Đang gửi OTP...' : 'Đang xác minh...'}
//                   </>
//                 ) : countdown === 0 ? (
//                   'Gửi lại OTP'
//                 ) : (
//                   'Xác minh OTP'
//                 )}
//               </Button>
//             )}
//           </CardContent>

//           <CardFooter className="text-center text-sm text-gray-600">
//             <Separator />
//             <div className="pt-4">
//               Đã có tài khoản?{' '}
//               <Button
//                 variant="link"
//                 className="text-orange-600 hover:text-orange-700 font-medium p-0"
//                 onClick={() => navigate('/login')}
//               >
//                 Đăng nhập ngay
//               </Button>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, ArrowLeft, Check, XCircle, ShieldCheck } from 'lucide-react'; // 👈 Phone → Mail
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Separator } from '../../components/ui/separator';
import { cn } from '../../components/ui/utils';
import { Logo } from '../../components/Logo';
import { useAuth } from '../../contexts/AuthContext';

export default function PhoneVerification() {
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    if (state.isAuthenticated) {
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
    }
  }, [state.isAuthenticated, navigate]);

  const [phone, setPhone] = useState(''); // 👈 giữ tên phone để không đổi state khác
  const [phoneError, setPhoneError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const phoneRef = useRef(null);

  // const hosts = ['https://badafuta-production.up.railway.app/api'];
  const hosts = ['https://badafuta.onrender.com/api'];

  const fetchWithTimeout = (url, options, timeout = 5000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout)),
    ]);
  };

  const tryHosts = async (path, payload) => {
    const promises = hosts.map((host) =>
      fetchWithTimeout(
        `${host}${path}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        },
        5000,
      )
        .then((res) => {
          if (!res.ok) throw new Error(`Server ${host} trả lỗi`);
          return res.json().then((data) => ({ data, host }));
        })
        .catch((err) => {
          console.warn(err.message);
          return Promise.reject();
        }),
    );
    return Promise.any(promises);
  };

  // 👇 đổi validation sang email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleChange = (value) => {
    setPhone(value);
    if (!value) setPhoneError('');
    else if (!emailRegex.test(value)) setPhoneError('Email không hợp lệ!');
    else setPhoneError('');
  };

  const startCountdown = () => setCountdown(60);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const normalizedPhone = phone.trim();
    if (!normalizedPhone || phoneError || !emailRegex.test(normalizedPhone)) {
      // 👈
      setPhoneError('Vui lòng nhập email hợp lệ!');
      phoneRef.current?.focus();
      return;
    }
    setLoading(true);
    setPhoneError('');
    setOtpError('');
    setOtpMessage('');
    try {
      const { data, host } = await tryHosts('/otp/send', {
        email: normalizedPhone, // 👈 đổi key thành email
      });
      if (data.success) {
        setOtpSent(true);
        setOtpMessage(`Đã gửi mã OTP thành công đến email ${phone}!`); // 👈
        startCountdown();
      } else {
        setOtpError(data.message || 'Không thể gửi OTP!');
      }
    } catch (err) {
      console.error('Lỗi fetch:', err);
      setOtpError('Không thể kết nối server!');
      phoneRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError('Vui lòng nhập mã OTP!');
      return;
    }
    setLoading(true);
    setOtpError('');
    setOtpMessage('');
    try {
      const { data } = await tryHosts('/otp/verify', { email: phone, otp }); // 👈 đổi key thành email
      if (data.success) {
        setOtpError('');
        setOtpMessage('Xác minh thành công!');
        setTimeout(() => navigate('/register', { state: { phone } }), 500);
      } else {
        setOtpError(data.message || 'OTP không đúng!');
      }
    } catch (err) {
      console.error('Lỗi fetch:', err);
      setOtpError('Không thể kết nối server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate('/login')}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại đăng nhập
        </Button>
        <Card className="hover:scale-100">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                <Logo size="lg" className="text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Xác minh email</CardTitle> {/* 👈 */}
            <CardDescription className="text-center">
              Vui lòng xác nhận email để tiếp tục đăng ký tài khoản {/* 👈 */}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Email *</Label> {/* 👈 */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />{' '}
                {/* 👈 */}
                <Input
                  id="phone"
                  type="email" // 👈
                  placeholder="Nhập email (VD: abc@gmail.com)" // 👈
                  value={phone}
                  onChange={(e) => handleChange(e.target.value)}
                  ref={phoneRef}
                  disabled={otpSent}
                  className={cn(
                    'pl-10 pr-10',
                    phoneError
                      ? 'border-red-500 hover:border-red-500 focus:border-red-500'
                      : emailRegex.test(phone) // 👈
                      ? 'border-green-500 hover:border-green-500 focus:border-green-500'
                      : 'border-gray-300',
                  )}
                />
                {phoneError && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                )}
                {!phoneError && emailRegex.test(phone) && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                )}{' '}
                {/* 👈 */}
              </div>
              {phoneError && <p className="text-xs text-red-500 text-left">{phoneError}</p>}
            </div>

            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Mã OTP</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setOtpError('');
                    }}
                    className={cn(
                      'pl-10 pr-10',
                      otpError
                        ? 'border-red-500 hover:border-red-500 focus:border-red-500'
                        : otp.length > 0
                        ? 'border-green-500 hover:border-green-500 focus:border-green-500'
                        : 'border-gray-300',
                    )}
                  />
                  {otpError && (
                    <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  )}
                </div>
                {otpError && <p className="text-xs text-red-500">{otpError}</p>}
                {otpMessage && !otpError && <p className="text-xs text-green-500">{otpMessage}</p>}
                {countdown > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Bạn có thể gửi lại OTP sau {countdown}s
                  </p>
                )}
              </div>
            )}

            {!otpSent ? (
              <Button
                onClick={handleSendOtp}
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang gửi OTP...
                  </>
                ) : (
                  'Gửi OTP'
                )}
              </Button>
            ) : (
              <Button
                onClick={countdown === 0 ? handleSendOtp : handleVerifyOtp}
                className={`w-full ${
                  countdown === 0
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {countdown === 0 ? 'Đang gửi OTP...' : 'Đang xác minh...'}
                  </>
                ) : countdown === 0 ? (
                  'Gửi lại OTP'
                ) : (
                  'Xác minh OTP'
                )}
              </Button>
            )}
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-600">
            <Separator />
            <div className="pt-4">
              Đã có tài khoản?{' '}
              <Button
                variant="link"
                className="text-orange-600 hover:text-orange-700 font-medium p-0"
                onClick={() => navigate('/login')}
              >
                Đăng nhập ngay
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
