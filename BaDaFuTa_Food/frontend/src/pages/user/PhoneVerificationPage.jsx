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
import { Loader2, Mail, ArrowLeft, Check, XCircle, ShieldCheck } from 'lucide-react';
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
export default function EmailVerification() {
  const navigate = useNavigate();
  const { state } = useAuth();
  useEffect(() => {
    if (state.isAuthenticated) {
      const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
      localStorage.removeItem('redirectAfterLogin');
      navigate(redirectPath, { replace: true });
    }
  }, [state.isAuthenticated, navigate]);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const emailRef = useRef(null); // 👈 thêm ref
  // const hosts = ['https://badafuta-production.up.railway.app/api'];
  const hosts = ['https://badafuta.onrender.com/api'];

  const fetchWithTimeout = (url, options, timeout = 30000) => {
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
        8000,
      )
        .then(async (res) => {
          const data = await res.json(); // Đọc 1 lần duy nhất
          if (data.success) return { data, host };
          // Quăng Error kèm message từ BE để Promise.any gom lại
          throw new Error(data.message || 'Lỗi logic');
        })
        .catch((err) => {
          return Promise.reject(err);
        }),
    );
    return Promise.any(promises); // trả về host thành công đầu tiên
  };

  useEffect(() => {
    const otpEmail = sessionStorage.getItem('otpEmail');
    const otpSentAt = sessionStorage.getItem('otpSentAt');
    if (otpEmail && otpSentAt) {
      const elapsed = Math.floor((Date.now() - parseInt(otpSentAt)) / 1000);
      const remaining = 60 - elapsed;
      setEmail(otpEmail);
      setOtpSent(true);
      if (remaining > 0) setCountdown(remaining);
    }
  }, []);

  const handleEmailChange = (value) => {
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) setEmailError('');
    else if (!emailRegex.test(value)) setEmailError('Email không hợp lệ!');
    else setEmailError('');
  };
  const startCountdown = () => setCountdown(60);
  // Đếm ngược
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim(); // 👈 khai báo trước
    const savedEmail = sessionStorage.getItem('otpEmail');
    const currentCountdown = countdown; // 👈 lưu lại trước khi gọi API

    if (currentCountdown > 0 && normalizedEmail === savedEmail) {
      console.log('số giây còn lại', currentCountdown);
      // setOtpError(`Vui lòng chờ ${countdown}s trước khi gửi lại!`);
      setOtpError(
        `Email này vừa được gửi OTP, vui lòng chờ ${currentCountdown}s trước khi gửi lại hoặc dùng email khác!`,
      );

      return;
    }

    setOtpError('');

    // const normalizedEmail = email.trim();
    // ✅ Fix: set emailError thay vì otpError
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!normalizedEmail || emailError || !emailRegex.test(normalizedEmail)) {
      setEmailError('Vui lòng nhập email hợp lệ!'); // 👈 đây
      // setOtpError('Server đang khởi động, vui lòng thử lại sau 30 giây!');
      emailRef.current?.focus(); // 🔴 focus input
      return;
    }
    setLoading(true);
    setEmailError(''); // clear lỗi trước khi gửi
    setOtpError('');
    setOtpMessage('');
    try {
      // const res = await fetch("/api192/otp/send", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: normalizedEmail }),
      // });
      const { data, host } = await tryHosts('/otp/send', {
        email: normalizedEmail,
      });
      if (data.success) {
        setOtpSent(true);
        setOtp(''); // 👈 xóa OTP cũ
        setOtpMessage(`Đã gửi mã OTP thành công đến email: "${email}"!`);
        startCountdown();
        sessionStorage.setItem('otpEmail', normalizedEmail); // 👈
        sessionStorage.setItem('otpSentAt', Date.now().toString()); // 👈
      } else {
        setOtpError(data.message || 'Không thể gửi OTP!');
      }
    } catch (err) {
      console.error('Lỗi fetch:', err);
      if (currentCountdown === 0) {
        setOtpError('Không thể kết nối server!');
      }
      emailRef.current?.focus(); // 👈 focus nếu lỗi mạng
    } finally {
      setLoading(false);
    }
  };

  //
  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError('Vui lòng nhập mã OTP!');

      return;
    }
    if (otp.length < 6) {
      setOtpError('Vui lòng nhập đủ 6 số!');

      return;
    }

    if (loading) return;
    setLoading(true);
    setOtpError('');
    setOtpMessage('');
    try {
      const { data } = await tryHosts('/otp/verify', {
        email: email.trim().toLowerCase(),
        otp,
      });

      setOtpError('');
      setOtpMessage('Xác minh thành công!');
      sessionStorage.removeItem('otpEmail'); // 👈
      sessionStorage.removeItem('otpSentAt'); // 👈
      setTimeout(() => navigate('/register', { state: { email } }), 500);

      // setOtpError(data.message || 'OTP không đúng!');
    } catch (err) {
      // 🚩 XỬ LÝ LỖI Ở ĐÂY (Vì tryHosts đã throw lỗi khi success: false)
      console.error('Lỗi Verify:', err);

      // Lấy tin nhắn từ host đầu tiên trả về lỗi
      const msg = err.errors ? err.errors[0].message : err.message;

      if (msg.includes('hết hạn') || msg.includes('chưa được gửi')) {
        setOtpError('⚠️ Mã OTP đã hết hạn hoặc không tồn tại. Vui lòng nhấn "Gửi lại ngay".');
      } else if (msg.includes('không chính xác')) {
        setOtpError('Mã OTP không đúng, vui lòng thử lại!');
      } else {
        setOtpError('Không thể kết nối máy chủ hoặc có lỗi xảy ra!');
      }
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
            <CardTitle className="text-2xl text-center">Xác minh email</CardTitle>
            <CardDescription className="text-center">
              Vui lòng xác nhận email để tiếp tục đăng ký tài khoản
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="email">Email *</Label>
                {otpSent && (
                  <button
                    type="button"
                    className="text-xs text-orange-500 hover:text-orange-600 underline"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp('');
                      setOtpError('');
                      setOtpMessage('');
                      // setCountdown(0);
                      // sessionStorage.removeItem('otpEmail');
                      sessionStorage.removeItem('otpSentAt');
                    }}
                  >
                    Đổi email
                  </button>
                )}
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email (VD: abc@gmail.com)"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  ref={emailRef} // 👈 gắn ref
                  disabled={otpSent}
                  className={cn(
                    'pl-10 pr-10',
                    emailError
                      ? 'border-red-500 hover:border-red-500 focus:border-red-500'
                      : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                      ? 'border-green-500 hover:border-green-500 focus:border-green-500'
                      : 'border-gray-300',
                  )}
                />
                {emailError && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                )}
                {!emailError && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                )}
              </div>
              {emailError && <p className="text-xs text-red-500 text-left">{emailError}</p>}
            </div>
            {/* OTP input */}
            {/* OTP input */}
            {/* {otpSent && (
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
                </div> */}
            {/* Hiển thị thông báo OTP */}
            {/* {otpError && <p className="text-xs text-red-500">{otpError}</p>}
                {otpMessage && !otpError && <p className="text-xs text-green-500">{otpMessage}</p>}
                {countdown > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Bạn có thể gửi lại OTP sau {countdown}s
                  </p>
                )}
                {countdown === 0 && otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs text-orange-500 hover:text-orange-600 underline mt-1"
                    disabled={loading}
                  >
                    Gửi lại OTP
                  </button>
                )}
              </div>
            )} */}
            {/*  */}
            {/*  */}
            {/*  */}

            {otpSent && (
              <div className="space-y-3">
                <Label className="text-center block">Mã OTP</Label>

                {/* 6 ô riêng lẻ */}
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); // chỉ số
                        const otpArr = otp.split('');
                        otpArr[i] = val;
                        const newOtp = otpArr.join('').slice(0, 6);
                        setOtp(newOtp);
                        setOtpError('');
                        // tự động focus ô tiếp theo
                        if (val && i < 5) {
                          document.getElementById(`otp-${i + 1}`)?.focus();
                        }
                        if (newOtp.length === 6 && !loading) {
                          setTimeout(() => handleVerifyOtp(), 300);
                        }
                      }}
                      onKeyDown={(e) => {
                        // backspace → focus ô trước
                        if (e.key === 'Backspace' && !otp[i] && i > 0) {
                          document.getElementById(`otp-${i - 1}`)?.focus();
                        }
                      }}
                      onPaste={(e) => {
                        // paste cả chuỗi OTP
                        e.preventDefault();
                        const pasted = e.clipboardData
                          .getData('text')
                          .replace(/\D/g, '')
                          .slice(0, 6);
                        setOtp(pasted);
                        setOtpError('');
                        document.getElementById(`otp-${Math.min(pasted.length, 5)}`)?.focus();
                      }}
                      className={cn(
                        'w-11 h-12 text-center text-lg font-semibold border-2 rounded-lg outline-none transition-all',
                        otpError
                          ? 'border-red-500 text-red-500'
                          : otp[i]
                          ? 'border-orange-500 text-orange-600'
                          : 'border-gray-300 focus:border-orange-400',
                      )}
                    />
                  ))}
                </div>

                {/* otp hết hạn  */}
                {otpError && (
                  <div
                    className={cn(
                      'text-xs text-center p-2.5 rounded-xl mt-4 animate-in fade-in slide-in-from-top-1 duration-300',
                      otpError.includes('hết hạn')
                        ? 'bg-red-50 text-red-600 border border-red-100 font-semibold shadow-sm'
                        : 'text-red-500 font-medium',
                    )}
                  >
                    {otpError}
                  </div>
                )}

                {/* {otpError && <p className="text-xs text-red-500 text-center">{otpError}</p>} */}
                {otpMessage && !otpError && (
                  <p className="text-xs text-green-500 text-center">{otpMessage}</p>
                )}

                {countdown > 0 ? (
                  <p className="text-xs text-gray-500 text-center mt-2">
                    {' '}
                    Bạn có thể gửi lại OTP sau{' '}
                    <span className="font-bold text-orange-500">{countdown}s</span> · OTP có hiệu
                    lực trong 5 phút
                  </p>
                ) : (
                  <div className="text-center mt-2">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading}
                      className="text-xs text-orange-600 hover:text-orange-700 font-semibold underline disabled:opacity-50"
                    >
                      Tôi chưa nhận được mã? Gửi lại ngay
                    </button>
                  </div>
                )}
                {/* {countdown === 0 && otpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="text-xs text-orange-500 hover:text-orange-600 underline w-full text-center"
                    disabled={loading}
                  >
                    Gửi lại OTP
                  </button>
                )} */}
              </div>
            )}
            {/*  */}
            {/*  */}
            {/*  */}

            {/* Hiển thị lỗi khi chưa gửi OTP */}
            {countdown > 0 && !otpSent && (
              <p className="text-xs text-orange-500">
                Email này vừa được gửi OTP, vui lòng chờ {countdown}s trước khi gửi lại hoặc dùng
                email khác!
              </p>
            )}
            {/* {otpError && !otpSent && <p className="text-xs text-red-500">{otpError }</p>} */}
            {/* Button */}
            {!otpSent ? (
              <Button
                onClick={handleSendOtp}
                className="w-full bg-orange-500 hover:bg-orange-600 h-11 text-base font-bold transition-all shadow-md active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang gửi OTP...
                  </>
                ) : (
                  'Gửi mã xác thực'
                )}
              </Button>
            ) : (
              //   <Button
              //     onClick={countdown === 0 ? handleSendOtp : handleVerifyOtp}
              //     className={`w-full ${
              //       countdown === 0
              //         ? 'bg-orange-500 hover:bg-orange-600'
              //         : 'bg-green-600 hover:bg-green-700'
              //     }`}
              //     disabled={loading}
              //   >
              //     {loading ? (
              //       <>
              //         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              //         {countdown === 0 ? 'Đang gửi OTP...' : 'Đang xác minh...'}
              //       </>
              //     ) : countdown === 0 ? (
              //       'Gửi lại OTP'
              //     ) : (
              //       'Xác minh OTP'
              //     )}
              //   </Button>

              // Trường hợp 2: Đã gửi OTP -> Nút này LUÔN LUÔN là "Xác minh"
              <Button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 hover:bg-green-700 h-11 text-base font-bold transition-all shadow-md active:scale-[0.98]"
                disabled={loading || otp.length < 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang xác minh...
                  </>
                ) : (
                  'Xác minh tài khoản'
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
