import { useNavigate, Link } from "react-router-dom";
import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  UserCheck,
  Store,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [newUserUNFID, setNewUserUNFID] = useState("");

  const { register, state } = {
    full_name: "varchar",
    phone: "varchar",
    email: "varchar",
    password: "varchar",
    comfirmPassword: "varchar",
  };

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(""); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) return "Vui lòng nhập họ tên";
    if (!formData.phone.trim()) return "Vui lòng nhập số điện thoại";
    if (!formData.email.trim()) return "Vui lòng nhập email";
    if (!formData.password) return "Vui lòng nhập mật khẩu";
    if (!formData.confirmPassword) return "Vui lòng xác nhận mật khẩu";

    // Phone validation - must start with 0 and have exactly 10 digits
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      return "Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Email không hợp lệ";
    }

    if (formData.password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Mật khẩu xác nhận không khớp";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.full_name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json(); // đây sẽ là { success: true, user: {...} }

      if (!res.ok) {
        if (data.sdt) {
          // Nếu số điện thoại đã có → điều hướng sang login
          navigate("/login");
          return;
        }
        setError(data.error || "Đăng ký thất bại");
        return;
      }

      // Nếu success = true thì hiển thị popup
      setFormData({
        full_name: "",
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setShowSuccessDialog(true);
    } catch (err) {
      console.error("Register error:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };


  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back to home button */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>

          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
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
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Đăng ký</CardTitle>
              <CardDescription className="text-center">
                Tạo tài khoản mới để sử dụng dịch vụ đặt món
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-4 ">
                  {/* tăng khoảng cách chung */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="full_name"
                        type="text"
                        placeholder="Nhập họ và tên đầy đủ"
                        value={formData.full_name}
                        onChange={(e) =>
                          handleChange("full_name", e.target.value)
                        }
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Nhập số điện thoại (VD: 0123456789)"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                    <p className="text-xs text-left text-gray-500">
                      Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Nhập địa chỉ email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passwword">Mật khẩu *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="pass"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                        value={formData.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        className="pl-10 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
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
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Nhập lại mật khẩu *"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleChange("confirmPassword", e.target.value)
                        }
                        className="pl-10 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant=""
                    className="w-full "
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Đang tạo tài khoản...
                      </>
                    ) : (
                      "Đăng ký"
                    )}
                  </Button>
                </div>

                <div className="my-6">
                  {/* Separator với chữ "Hoặc" */}
                  <div className="flex items-center gap-4 mb-4">
                    <Separator className="flex-1" />
                    <span className="text-gray-500">Hoặc</span>
                    <Separator className="flex-1" />
                  </div>

                  {/* Nút đăng nhập Google và Facebook cùng hàng */}
                  <div className="flex gap-4">
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

                    <Button
                      variant="outline"
                      className="flex-1 flex items-center justify-center"
                    >
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/667px-2023_Facebook_icon.svg.png"
                        alt="Facebook"
                        className="w-5 h-5"
                      />
                      Facebook
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-600 mt-4">
                  <p className="text-center">
                    Bằng việc đăng kí, bạn đã đồng ý với BaDaFuTaFood về <br />{" "}
                    <Link
                      to="/"
                      className="text-orange-600 hover:text-orange-700 hover:underline "
                    >
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link
                      to="/"
                      className="text-orange-600 hover:text-orange-700 hover:underline "
                    >
                      Chính sách bảo mật
                    </Link>
                  </p>
                </div>
              </CardContent>
            </form>

            <CardFooter className="">
              <Separator />
              <div className="text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
                >
                  Đăng nhập ngay.
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      {/* Popup thành công */}
      {showSuccessDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg text-center">
            <p className="mb-4">Đăng ký thành công!</p>
            <Button onClick={handleSuccessDialogClose}>Sang trang đăng nhập</Button>
          </div>
        </div>
      )}
    </>
  );
  
}
