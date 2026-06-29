import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'react-hot-toast';
import { Shield, Lock, User } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://badafuta.onrender.com/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Email hoặc mật khẩu không chính xác');
      }

      localStorage.setItem('admin_token', data.token);
      if (data.admin) {
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
      }

      toast.success('Đăng nhập hệ thống thành công!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Không thể kết nối đến hệ thống máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-left">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">BADAFUTA Admin Portal</h1>
          <p className="text-gray-600 mt-2">Cổng kiểm soát và vận hành hệ thống</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl">Đăng nhập Admin</CardTitle>
            <CardDescription>Nhập thông tin xác thực quản trị viên</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Admin</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@badafuta.com"
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white transition-colors py-2 rounded-lg font-semibold"
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
