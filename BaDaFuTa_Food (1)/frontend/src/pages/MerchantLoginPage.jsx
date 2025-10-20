import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMerchant } from "../contexts/MerchantContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Separator } from "../components/ui/separator";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Logo } from "../components/Logo";
import { toast } from "sonner";
import { Store, Lock, User, ArrowLeft } from "lucide-react";

export default function MerchantLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  //const { merchantAuth } = useMerchant();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);

    // Mock authentication - trong thực tế sẽ gọi API
    setTimeout(() => {
      if (email === "merchant@badafuta.com" && password === "merchant123") {
        // Set merchant auth in localStorage
        const authData = { email };
        localStorage.setItem("merchantAuth", JSON.stringify(authData));
        toast.success("Đăng nhập thành công!");
        navigate("/merchant/dashboard");
      } else {
        toast.error("Email hoặc mật khẩu không đúng");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Về trang chủ
        </Button>
        {/* Logo */}
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">BADAFUTA Partner</h1>
          <p className="text-gray-600 mt-2">Đăng nhập để quản lý nhà hàng</p>
        </div>

        <Card className="shadow-xl border-0 hover:scale-100">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Store className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle className="text-xl">Đăng nhập Merchant</CardTitle>
            <CardDescription>
              Nhập thông tin đăng nhập để truy cập hệ thống quản lý
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="merchant@badafuta.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" variant="default" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <Separator />
              <p className="text-sm pt-6 text-gray-600 pb-6">
                Bạn là khách hàng?{" "}
                <Link
                  to="/homepage"
                  className="text-orange-600 hover:text-orange-700 hover:underline font-medium"
                >
                  Quay về trang chính
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 BADAFUTA. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </div>
  );
}
