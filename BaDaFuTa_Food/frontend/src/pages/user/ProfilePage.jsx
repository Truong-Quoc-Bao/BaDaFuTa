import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // 🔹 import auth
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avartar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Alert, AlertDescription } from '../../components/ui/alert';

export const ProfilePage = () => {
  const { state, updateUser } = useAuth();
  const user = state.user;

  //   const { state, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Các state quản lý đổi mật khẩu
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordFormError, setPasswordFormError] = useState(''); // Lỗi tổng khi bấm nút Xác nhận
  const [formDisabled, setFormDisabled] = useState(false);

  // Các state quản lý ẩn/hiện mật khẩu
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [editData, setEditData] = useState({
    name: state.user?.full_name || '',
    email: state.user?.email || '',
    phone: state.user?.phone || '',
    address: state.user?.address || '',
    dateOfBirth: state.user?.dateOfBirth || '',
    gender: state.user?.gender || '',
  });

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    if (state.user) {
      // Định dạng lại ngày sinh thành YYYY-MM-DD để thẻ <input type="date"> không bị lỗi hiển thị
      const formattedDate = state.user.dateOfBirth ? state.user.dateOfBirth.split('T')[0] : '';

      // Nếu số điện thoại chứa chuỗi 'GG_' thì đưa về rỗng để người dùng dễ sửa đổi
      const cleanPhone =
        state.user.phone && !state.user.phone.startsWith('GG_') ? state.user.phone : '';

      setEditData({
        name: state.user.full_name || '',
        email: state.user.email || '',
        phone: cleanPhone,
        address: state.user.address || '',
        dateOfBirth: formattedDate,
        gender: state.user.gender || '',
        avatar: state.user.avatar || '',
      });
    }
  }, [state.user]);

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://badafuta.onrender.com/api/update', {
        method: 'PUT', // Hoặc POST tùy quy chuẩn API ở backend
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Gửi kèm token xác thực
        },
        body: JSON.stringify({
          full_name: editData.name,
          email: editData.email,
          phone: editData.phone,
          address: editData.address,
          dateOfBirth: editData.dateOfBirth,
          gender: editData.gender,
          avatar: editData.avatar,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Không thể cập nhật thông tin.');
      }

      // Backend trả về bản cập nhật thành công (data.user hoặc trực tiếp là data)
      const updatedUser = data.user || data;

      // Cập nhật lưu trữ ở trình duyệt và Context
      localStorage.setItem('user', JSON.stringify(updatedUser));
      updateUser(updatedUser);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user in auth context
      if (state.user) {
        updateUser({
          ...state.user,
          ...editData,
        });
      }

      setSuccess('Thông tin đã được cập nhật thành công!');
      setIsEditing(false);
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (state.user) {
      const cleanPhone =
        state.user.phone && !state.user.phone.startsWith('GG_') ? state.user.phone : '';

      setEditData({
        name: state.user.full_name || '',
        email: state.user.email || '',
        phone: cleanPhone,
        address: state.user.address || '',
        dateOfBirth: state.user.dateOfBirth ? state.user.dateOfBirth.split('T')[0] : '',
        gender: state.user.gender || '',
        avatar: state.user.avatar || '',
      });
    }

    // setEditData({
    //   name: state.user?.full_name || '',
    //   email: state.user?.email || '',
    //   phone: state.user?.phone || '',
    //   address: state.user?.address || '',
    //   dateOfBirth: state.user?.dateOfBirth || '',
    // });
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  //
  // Hàm kiểm tra độ mạnh yếu khi gõ mật khẩu mới
  // 1. Hàm kiểm tra độ mạnh yếu khi gõ mật khẩu mới
  const handleNewPasswordChange = (value) => {
    setNewPassword(value);

    if (!value) {
      setPasswordError('');
      return;
    }

    if (value.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    const hasUppercase = /[A-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasSpecial = /[!@#$%^&*()_\-+=\[\]{};:"',.<>/?\\|]/.test(value);

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
  };

  // 2. Hàm kiểm tra khớp mật khẩu khi gõ ô Xác nhận mật khẩu mới
  const handleConfirmPasswordChange = (value) => {
    setConfirmNewPassword(value);
    if (!newPassword) {
      setConfirmPasswordError('⚠️ Vui lòng nhập mật khẩu mới trước');
    } else if (value !== newPassword) {
      setConfirmPasswordError('⚠️ Mật khẩu xác nhận không khớp');
    } else {
      setConfirmPasswordError('');
    }
  };

  // 3. Hàm gọi API khi bấm nút Xác nhận lưu mật khẩu
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordFormError(''); // Chỉ xóa lỗi submit chính
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordFormError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }
    if (!/[a-zA-Z]/.test(newPassword)) {
      setPasswordFormError('Mật khẩu mới phải chứa ít nhất 1 chữ cái.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setConfirmPasswordError('⚠️ Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsPasswordLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('https://badafuta.onrender.com/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Đổi mật khẩu thất bại.');

      setPasswordSuccess('Mật khẩu của bạn đã được cập nhật thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setPasswordError(''); // Xóa độ mạnh yếu sau khi đổi thành công

      setTimeout(() => {
        setIsChangingPassword(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (err) {
      setPasswordFormError(err.message || 'Mật khẩu cũ không đúng hoặc có lỗi xảy ra.');
    } finally {
      setIsPasswordLoading(false);
    }
  };

  // Hàm tự động gọi API Quên mật khẩu bằng email đang đăng nhập
  const handleAutoForgotPassword = async () => {
    if (!state.user?.email) return;

    setIsPasswordLoading(true);
    setPasswordFormError(''); // Đổi thành passwordFormError
    setPasswordSuccess('');

    try {
      const res = await fetch('https://badafuta.onrender.com/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: state.user.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gửi yêu cầu thất bại.');

      setPasswordSuccess('Hệ thống đã gửi link đặt lại mật khẩu mới vào Email của bạn!');
      setFormDisabled(true); // 👈 Tự động khóa form khi gửi mail thành công
    } catch (err) {
      setPasswordFormError(err.message || 'Không thể gửi yêu cầu đặt lại mật khẩu.'); // Đổi thành passwordFormError
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (!state.user) {
    return (
      <div className=" bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md hover:scale-100">
          <CardContent className="p-6 text-center">
            <p>Vui lòng đăng nhập để xem thông tin cá nhân</p>
            <Button onClick={() => navigate('/login')} className="mt-4">
              Đăng nhập
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-6 bg-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="hover:scale-100">
              <CardContent className="p-6 text-center">
                {/* <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={state.user.avatar} />
                  <AvatarFallback className="text-2xl">
                    {getInitials(state.user.full_name)}
                  </AvatarFallback>
                </Avatar> */}

                <div className="relative w-28 h-28 mx-auto mb-4">
                  <Avatar className="w-full h-full border-4 border-orange-400 shadow-md rounded-full">
                    <AvatarImage
                      src={editData.avatar || state.user?.avatar || ''}
                      alt={state.user?.full_name}
                      className="object-cover rounded-full"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-orange-300 to-orange-500 text-white font-semibold text-2xl flex items-center justify-center rounded-full">
                      {getInitials(state.user?.full_name)}
                    </AvatarFallback>
                  </Avatar>

                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        id="avatar-upload"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setEditData({
                                ...editData,
                                avatar: reader.result,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </label>
                    </>
                  )}
                </div>

                <h2 className="text-xl font-semibold mb-2">{state.user.full_name}</h2>
                <p className="text-gray-600 mb-3">{state.user.email}</p>

                <Badge variant="secondary" className="mb-4">
                  {state.user.role === 'customer' ? 'Khách hàng' : 'Chủ cửa hàng'}
                </Badge>

                {state.user.unfid && (
                  <div className="text-sm text-gray-500">
                    <p>UNFID: {state.user.unfid}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* change password */}
            {/* CARD BẢO MẬT (ĐỔI MẬT KHẨU) */}
            <Card className="hover:scale-100 mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-orange-500" />
                  Bảo mật tài khoản
                </h3>

                {!isChangingPassword ? (
                  <Button
                    variant="outline"
                    className="w-full border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Đổi mật khẩu
                  </Button>
                ) : (
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    {passwordFormError && (
                      <Alert variant="destructive" className="py-2 px-3">
                        <AlertDescription className="text-xs">{passwordFormError}</AlertDescription>
                      </Alert>
                    )}
                    {passwordSuccess ? (
                      // 🔹 KHI THÀNH CÔNG: Ẩn hết các ô nhập liệu thừa đi, chỉ hiện thông báo và nút Đóng
                      <div className="space-y-4 text-center py-2">
                        <Alert className="border-green-200 bg-green-50 py-3 px-4">
                          <AlertDescription className="text-xs text-green-800 font-semibold leading-relaxed">
                            {passwordSuccess}
                          </AlertDescription>
                        </Alert>
                        <Button
                          type="button"
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs py-2"
                          onClick={() => {
                            setIsChangingPassword(false);
                            setPasswordSuccess('');
                            setOldPassword('');
                            setNewPassword('');
                            setConfirmNewPassword('');
                            setConfirmPasswordError('');
                            setPasswordError('');
                          }}
                        >
                          Đóng bảo mật
                        </Button>
                      </div>
                    ) : (
                      <>
                        {/* Ô mật khẩu cũ */}
                        <div className="space-y-1">
                          {/* ĐÃ CẬP NHẬT: Thêm nút Quên mật khẩu bên phải */}
                          <div className="flex justify-between items-center">
                            <Label className="text-xs font-medium">Mật khẩu cũ</Label>
                            <button
                              type="button"
                              onClick={handleAutoForgotPassword} // Gọi hàm tự động gửi mail quên mật khẩu
                              disabled={isPasswordLoading}
                              className="text-[10px] text-orange-500 hover:underline font-semibold disabled:opacity-50"
                            >
                              Quên mật khẩu?
                            </button>
                          </div>

                          <div className="relative">
                            <Input
                              type={showOldPassword ? 'text' : 'password'}
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              placeholder="••••••••"
                              required
                              className="h-9 text-sm pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowOldPassword(!showOldPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showOldPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Ô mật khẩu mới */}
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Mật khẩu mới</Label>
                          <div className="relative">
                            <Input
                              type={showNewPassword ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => handleNewPasswordChange(e.target.value)}
                              placeholder="Tối thiểu 6 ký tự"
                              required
                              className={`h-9 text-sm pr-10 ${
                                passwordError
                                  ? passwordError.includes('ít nhất 6') ||
                                    passwordError.includes('chữ cái') ||
                                    passwordError === 'Mật khẩu yếu'
                                    ? 'border-red-500 focus:border-red-500'
                                    : passwordError === 'Mật khẩu trung bình'
                                    ? 'border-yellow-500 focus:border-yellow-500'
                                    : passwordError === 'Mật khẩu khá'
                                    ? 'border-yellow-300 focus:border-yellow-300'
                                    : passwordError === 'Mật khẩu mạnh - tốt'
                                    ? 'border-green-500 focus:border-green-500'
                                    : ''
                                  : ''
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showNewPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          {passwordError && (
                            <p
                              className={`text-[10px] text-left font-semibold ${
                                passwordError.includes('ít nhất 6') ||
                                passwordError.includes('chữ cái') ||
                                passwordError === 'Mật khẩu yếu'
                                  ? 'text-red-500'
                                  : passwordError === 'Mật khẩu trung bình'
                                  ? 'text-yellow-500'
                                  : passwordError === 'Mật khẩu khá'
                                  ? 'text-yellow-500'
                                  : passwordError === 'Mật khẩu mạnh - tốt'
                                  ? 'text-green-500'
                                  : 'text-red-500'
                              }`}
                            >
                              {passwordError}
                            </p>
                          )}
                        </div>

                        {/* Ô xác nhận mật khẩu mới */}
                        <div className="space-y-1">
                          <Label className="text-xs font-medium">Xác nhận mật khẩu mới</Label>
                          <div className="relative">
                            <Input
                              type={showConfirmNewPassword ? 'text' : 'password'}
                              value={confirmNewPassword}
                              onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                              placeholder="Nhập lại mật khẩu mới"
                              required
                              className={`h-9 text-sm pr-10 ${
                                confirmPasswordError ? 'border-red-500 focus:border-red-500' : ''
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmNewPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                          {confirmPasswordError && (
                            <p className="text-[10px] text-left font-semibold text-red-500">
                              {confirmPasswordError}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-2 pt-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="w-1/2 text-gray-500 text-xs"
                            onClick={() => {
                              setIsChangingPassword(false);
                              setOldPassword('');
                              setNewPassword('');
                              setConfirmNewPassword('');
                              setPasswordError('');
                              setConfirmPasswordError('');
                              setPasswordFormError('');
                            }}
                            disabled={isPasswordLoading}
                          >
                            Hủy
                          </Button>
                          <Button
                            type="submit"
                            variant="default"
                            size="sm"
                            className="w-1/2 text-xs bg-orange-500 hover:bg-orange-600 text-white"
                            disabled={isPasswordLoading}
                          >
                            {isPasswordLoading ? 'Đang lưu...' : 'Xác nhận'}
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="hover:scale-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <User className="w-5 h-5 mr-2 text-orange-500" />
                  Thông tin cá nhân
                </CardTitle>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
                      <X className="w-4 h-4 mr-2" />
                      Hủy
                    </Button>
                    <Button
                      variant="default"
                      className="w-[120px]"
                      size="sm"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">{success}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Họ và tên
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <p className="text-gray-900 capitalize">{state.user.full_name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        placeholder="Nhập email"
                      />
                    ) : (
                      <p className="text-gray-900">{state.user.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Số điện thoại
                    </Label>
                    {isEditing ? (
                      <Input
                        value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      // <p className="text-gray-900">{state.user.phone || 'Chưa cập nhật'}</p>
                      <p className="text-gray-900">
                        {state.user.phone && !state.user.phone.startsWith('GG_')
                          ? state.user.phone
                          : 'Chưa cập nhật'}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Ngày sinh
                    </Label>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editData.dateOfBirth}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            dateOfBirth: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <p className="text-gray-900">{formatDate(state.user.dateOfBirth || '')}</p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Address */}
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Địa chỉ
                  </Label>
                  {isEditing ? (
                    <Input
                      value={editData.address}
                      onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                      placeholder="Nhập địa chỉ"
                    />
                  ) : (
                    <p className="text-gray-900">{state.user.address || 'Chưa cập nhật'}</p>
                  )}
                </div>

                {/* Gender (readonly) */}
                {/* <div className="space-y-2">
                  <Label>Giới tính</Label>
                  <p className="text-gray-900">
                    {state.user.gender === "male"
                      ? "Nam"
                      : state.user.gender === "female"
                      ? "Nữ"
                      : state.user.gender === "other"
                      ? "Khác"
                      : "Chưa cập nhật"}
                  </p>
                </div> */}

                <div className="space-y-2">
                  <Label>Giới tính</Label>
                  {isEditing ? (
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={editData.gender === 'male'}
                          onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                        />
                        <span>Nam</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={editData.gender === 'female'}
                          onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                        />
                        <span>Nữ</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={editData.gender === 'other'}
                          onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                        />
                        <span>Khác</span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-gray-900">
                      {state.user.gender === 'male'
                        ? 'Nam'
                        : state.user.gender === 'female'
                        ? 'Nữ'
                        : state.user.gender === 'other'
                        ? 'Khác'
                        : 'Chưa cập nhật'}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
