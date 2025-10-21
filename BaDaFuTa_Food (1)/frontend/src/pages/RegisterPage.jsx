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
  Check,
  XCircle,
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
import { Logo } from "../components/Logo";
import { Button } from "../components/ui/button";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { cn } from "../components/ui/utils";

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
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showPhoneExists, setShowPhoneExists] = useState(false); // Thông báo trùng SĐT
  //const [showEmailExists, setShowEmailExistss] = useStates(false);
  const [newUserUNFID, setNewUserUNFID] = useState("");

  const { register, state } = {
    full_name: "varchar",
    phone: "varchar",
    email: "varchar",
    password: "varchar",
    comfirmPassword: "varchar",
  };

  const navigate = useNavigate();

  // Phone validation - must start with 0 and have exactly 10 digits

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");

    // ✅ Kiểm tra lỗi số điện thoại nếu field là phone
    if (field === "phone") {
      const phoneRegex = /^0\d{9}$/;

      if (!value) setPhoneError("");
      else if (!value.startsWith("0"))
        setPhoneError("Số điện thoại phải bắt đầu bằng số 0");
      else if (value.length > 10)
        setPhoneError("Số điện thoại không được quá 10 số");
      else if (!phoneRegex.test(value))
        setPhoneError("Số điện thoại phải có đúng 10 chữ số");
      else setPhoneError("");
    }

    //check email
    if (field === "email") {
      const vietnameseRegex = /[^\u0000-\u007F]/; // ký tự có dấu tiếng Việt hoặc Unicode lạ
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!value) {
        setEmailError("");
      } else if (vietnameseRegex.test(value)) {
        setEmailError(
          "Email không được chứa ký tự có dấu hoặc ký tự đặc biệt lạ"
        );
      } else if (!value.includes("@")) {
        setEmailError("Email phải có ký tự '@'");
      } else if (!/\.[a-zA-Z]{2,}$/.test(value)) {
        setEmailError("Email phải có tên miền hợp lệ (vd: .com, .vn)");
      } else if (!emailRegex.test(value)) {
        setEmailError("Email không hợp lệ, vui lòng kiểm tra lại");
      } else {
        setEmailError("");
      }
    }

    if (field === "password") {
      const hasUppercase = /[A-Z]/.test(value); //ít nhất 1 chữ in hoa
      const hasNumber = /\d/.test(value); //ít nhất 1 số
      const hasLetter = /[a-zA-z]/.test(value); // ít nhất 1 chữ thường
      const hasSpecial = /[!@#$%^&*()_\-+=\[\]{};:"',.<>/?\\|]/.test(value);

      if (!value) {
        setPasswordError("");
      } else if (value.length < 6) {
        setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
      } else {
        const hasUppercase = /[A-Z]/.test(value);
        const hasNumber = /\d/.test(value);
        //const hasLetter = /[a-zA-Z]/.test(formData.password);
        const hasLetter = /[a-zA-Z]/.test(value); // chú ý A-Z
        const hasSpecial = /[!@#$%^&*()_\-+=\[\]{};:"',.<>/?\\|]/.test(value);

        // bắt buộc có chữ
        if (!hasLetter) {
          setPasswordError("Mật khẩu phải chứa ít nhất 1 chữ cái.");
        } else {
          // tính điểm phụ thuộc các yếu tố (chữ đã có)
          let score = 0;
          if (hasUppercase) score++;
          if (hasNumber) score++;
          if (hasSpecial) score++;

          // map score -> thông báo
          if (score === 0) {
            setPasswordError("Mật khẩu yếu"); // chỉ có chữ
          } else if (score === 1) {
            setPasswordError("Mật khẩu trung bình"); // chữ + 1 yếu tố
          } else if (score === 2) {
            setPasswordError("Mật khẩu khá"); // chữ + 2 yếu tố
          } else {
            // score === 3
            setPasswordError("Mật khẩu mạnh - tốt"); // đầy đủ
          }
        }
      }
    }
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) return "Vui lòng nhập họ tên";
    if (!formData.phone.trim()) return "Vui lòng nhập số điện thoại";
    if (!formData.email.trim()) return "Vui lòng nhập email";
    if (!formData.password) return "Vui lòng nhập mật khẩu";
    if (!formData.confirmPassword) return "Vui lòng xác nhận mật khẩu";

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

  //submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);

      if (validationError.includes("họ tên")) {
        document.getElementById("full_name").focus();
      } else if (validationError.includes("số điện thoại")) {
        document.getElementById("phone").focus();
      } else if (validationError.includes("email")) {
        document.getElementById("email").focus();
      } else if (validationError.includes("Mật khẩu")) {
        document.getElementById("pass").focus();
      } else if (validationError.includes("Mật khẩu xác nhận")) {
        document.getElementById("confirmPassword").focus();
      }
      return;
    }
    // ✅ Kiểm tra phone hợp lệ trước submit
    if (phoneError || formData.phone.length !== 10) {
      //setError("Vui lòng nhập số điện thoại hợp lệ 10 chữ số");
      document.getElementById("phone").focus();
      return;
    }

    // ✅ Kiểm tra email hợp lệ
    if (emailError) {
      //setError("Vui lòng nhập email hợp lệ");
      document.getElementById("email").focus();
      return;
    }

    if (!/[a-zA-Z]/.test(formData.password)) {
      setPasswordError("Mật khẩu phải chứa ít nhất 1 chữ cái.");
      document.getElementById("pass").focus();
      return;
    }


    setIsLoading(true);
    setError("");
    setShowPhoneExists(false);

    try {
      // const res = await fetch("http://localhost:3000/api/register", {
      const res = await fetch("http://172.20.10.3:3000/api/register", {
      // const res = await fetch("http://192.168.100.124:3000/api/register", {
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
          setShowPhoneExists(true);
          return;
        }
        if (data.email) {
          setEmailError("⚠️ Email này đã được đăng ký"); // ← hiển thị thông báo
          document.getElementById("email").focus();
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
      // Thành công
      alert("Đăng ký thành công!");
      navigate("/login");
      setShowSuccessDialog(true);
    } catch (err) {
      console.error("Register error:", err);
      setError("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSuccessDialogClose = () => {
  //   setShowSuccessDialog(false);
  //   navigate("/login", { replace: true });
  // };

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

              <CardTitle className="text-2xl text-center">Đăng ký</CardTitle>
              <CardDescription className="text-center">
                Tạo tài khoản mới để sử dụng dịch vụ đặt món
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent>
                {/* {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )} */}
                {!showPhoneExists && (
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
                          className={cn(
                            "pl-10 border transition-colors duration-200 focus:ring-0 focus:outline-none",
                            !formData.full_name && error?.includes("họ tên")
                              ? "border-red-500 focus:border-red-500"
                              : "border-gray-300 focus:border-transparent"
                          )}
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
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className={cn(
                            "pl-10 pr-10 border transition-colors duration-200 focus:ring-0 focus:outline-none",
                            !formData.phone && error?.includes("số điện thoại")
                              ? "border-red-500 focus:border-red-500"
                              : phoneError
                              ? "border-red-500 hover:border-red-500 focus:border-red-500"
                              : formData.phone.length === 10 && !phoneError
                              ? "border-green-500 hover:border-green-500 focus:border-green-500"
                              : "border-gray-300 focus:border-transparent"
                          )}
                          disabled={isLoading}
                        />
                        {/* ❌ Dấu X khi lỗi */}
                        {phoneError && (
                          <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                        )}

                        {/* ✅ Dấu tích khi hợp lệ */}
                        {!phoneError && formData.phone.length === 10 && (
                          <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                      </div>
                      {phoneError && (
                        <p className="text-xs text-red-500 text-left">
                          {phoneError}
                        </p>
                      )}
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
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          className={cn(
                            "pl-10 pr-10 border transition-colors duration-200 focus:ring-0 focus:outline-none",
                            !formData.email && error?.includes("email")
                              ? "border-red-500 focus:border-red-500"
                              : emailError
                              ? "border-red-500 hover:border-red-500 focus:border-red-500"
                              : formData.email && !emailError
                              ? "border-green-500 hover:border-green-500 focus:border-green-500"
                              : "border-gray-300 focus:border-transparent"
                          )}
                          disabled={isLoading}
                        />

                        {/* ❌ Icon lỗi */}
                        {emailError && (
                          <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                        )}

                        {/* ✅ Icon đúng */}
                        {!emailError && formData.email && (
                          <UserCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                        )}
                      </div>

                      {emailError && (
                        <p className="text-xs text-red-500 text-left">
                          {emailError}
                        </p>
                      )}
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
                          className={cn(
                            "pl-10 pr-10 border transition-colors duration-200 focus:ring-0 focus:outline-none",
                            !formData.password && error?.includes("mật khẩu")
                              ? "border-red-500 focus:border-red-500"
                              : passwordError
                              ? passwordError.includes("ít nhất 6")
                                ? "border-red-500 hover:border-red-500 focus:border-red-500"
                                : passwordError === "Mật khẩu yếu"
                                ? "border-red-500 hover:border-red-500 focus:border-red-500"
                                : passwordError === "Mật khẩu trung bình"
                                ? "border-yellow-500 hover:border-yellow-500 focus:border-yellow-500"
                                : passwordError === "Mật khẩu khá"
                                ? "border-yellow-300 hover:border-yellow-300 focus:border-yellow-300"
                                : passwordError === "Mật khẩu mạnh - tốt"
                                ? "border-green-500 hover:border-green-500 focus:border-green-500"
                                : "border-gray-300 focus:border-orange-500"
                              : "border-gray-300 focus:border-transparent"
                          )}
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
                      {passwordError && (
                        <p
                          className={cn(
                            "text-xs text-left transition-colors duration-200",
                            passwordError.includes("ít nhất 6")
                              ? "text-red-500"
                              : passwordError === "Mật khẩu yếu"
                              ? "text-red-500"
                              : passwordError === "Mật khẩu trung bình"
                              ? "text-yellow-500"
                              : passwordError === "Mật khẩu khá"
                              ? "text-yellow-300"
                              : passwordError === "Mật khẩu mạnh - tốt"
                              ? "text-green-500"
                              : "text-red-500"
                          )}
                        >
                          {passwordError}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Xác nhận mật khẩu *
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu *"
                          value={formData.confirmPassword}
                          onChange={(e) => {
                            const value = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              confirmPassword: value,
                            }));

                            if (!formData.password) {
                              // ❌ Chưa nhập mật khẩu chính mà lại nhập confirm
                              setconfirmPassword(
                                "⚠️ Vui lòng nhập mật khẩu trước"
                              );
                            } else if (value !== formData.password) {
                              // ❌ Không khớp
                              setconfirmPassword(
                                "⚠️ Mật khẩu xác nhận không khớp"
                              );
                            } else {
                              // ✅ Khớp
                              setconfirmPassword("");
                            }
                          }}
                          className={cn(
                            "pl-10 pr-10 border transition-colors duration-200 focus:ring-0 focus:outline-none",
                            !formData.confirmPassword &&
                              error?.includes("xác nhận mật khẩu")
                              ? "border-red-500 focus:border-red-500"
                              : confirmPassword
                              ? "border-red-500 focus:border-red-500"
                              : formData.confirmPassword && !confirmPassword
                              ? "border-green-500 focus:border-green-500"
                              : "border-gray-300 focus:border-transparent" // mặc định nếu rỗng nhưng chưa submit
                          )}
                          disabled={isLoading}
                        />
                        {/* Nút ẩn/hiện mật khẩu */}
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={isLoading}
                          F
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {confirmPassword && (
                        <p className="text-xs text-red-500 text-left">
                          {confirmPassword}
                        </p>
                      )}

                      {!confirmPassword &&
                        formData.confirmPassword &&
                        formData.password === formData.confirmPassword && (
                          <p className="text-xs text-green-500 text-left">
                            ✅ Mật khẩu khớp
                          </p>
                        )}
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
                )}
                {/* Hiện khung khi SĐT đã đăng ký */}
                {showPhoneExists && (
                  <div className="text-center space-y-4">
                    <p className="text-red-600 font-medium">
                      ⚠️ Số điện thoại này đã được đăng ký.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => navigate("/login")}
                        className="px-4 py-2 w-[115px] h-[40px] rounded transition"
                      >
                        Đăng nhập
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setShowPhoneExists(false)}
                        className=" w-[130px] h-[40px] px-4 py-2 rounded transition"
                      >
                        Nhập số khác
                      </Button>
                    </div>
                  </div>
                )}
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
            <Button onClick={handleSuccessDialogClose}>
              Sang trang đăng nhập
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
