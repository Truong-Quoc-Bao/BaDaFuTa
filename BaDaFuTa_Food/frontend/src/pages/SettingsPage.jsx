import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  Globe,
  Shield,
  Moon,
  Sun,
  Smartphone,
  CreditCard,
  MapPin,
  HelpCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Badge } from "../components/ui/badge";

export const SettingsPage = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    // Notifications
    orderUpdates: true,
    promotions: true,
    emailNotifications: false,
    smsNotifications: true,

    // Preferences
    language: "vi",
    currency: "VND",
    theme: "light",

    // Privacy & Security
    savePaymentMethods: true,
    shareLocation: true,
    biometricAuth: false,
    twoFactorAuth: false,
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const settingsCategories = [
    {
      title: "Thông báo",
      icon: Bell,
      items: [
        {
          key: "orderUpdates",
          label: "Cập nhật đơn hàng",
          description: "Nhận thông báo về trạng thái đơn hàng",
          type: "switch",
          value: settings.orderUpdates,
        },
        {
          key: "promotions",
          label: "Khuyến mại & Ưu đãi",
          description: "Nhận thông báo về các chương trình khuyến mại",
          type: "switch",
          value: settings.promotions,
        },
        {
          key: "emailNotifications",
          label: "Thông báo Email",
          description: "Nhận thông báo qua email",
          type: "switch",
          value: settings.emailNotifications,
        },
        {
          key: "smsNotifications",
          label: "Thông báo SMS",
          description: "Nhận thông báo qua tin nhắn",
          type: "switch",
          value: settings.smsNotifications,
        },
      ],
    },
    {
      title: "Tùy chọn hiển thị",
      icon: Globe,
      items: [
        {
          key: "language",
          label: "Ngôn ngữ",
          description: "Chọn ngôn ngữ hiển thị",
          type: "select",
          value: settings.language,
          options: [
            { value: "vi", label: "Tiếng Việt" },
            { value: "en", label: "English" },
          ],
        },
        {
          key: "currency",
          label: "Tiền tệ",
          description: "Đơn vị tiền tệ hiển thị",
          type: "select",
          value: settings.currency,
          options: [
            { value: "VND", label: "VND (₫)" },
            { value: "USD", label: "USD ($)" },
          ],
        },
        {
          key: "theme",
          label: "Giao diện",
          description: "Chọn chế độ hiển thị",
          type: "select",
          value: settings.theme,
          options: [
            { value: "light", label: "Sáng" },
            { value: "dark", label: "Tối" },
            { value: "auto", label: "Tự động" },
          ],
        },
      ],
    },
    {
      title: "Bảo mật & Quyền riêng tư",
      icon: Shield,
      items: [
        {
          key: "savePaymentMethods",
          label: "Lưu phương thức thanh toán",
          description: "Lưu thẻ và ví điện tử để thanh toán nhanh",
          type: "switch",
          value: settings.savePaymentMethods,
        },
        {
          key: "shareLocation",
          label: "Chia sẻ vị trí",
          description: "Cho phép ứng dụng truy cập vị trí để giao hàng",
          type: "switch",
          value: settings.shareLocation,
        },
        {
          key: "biometricAuth",
          label: "Xác thực sinh trắc học",
          description: "Sử dụng vân tay hoặc Face ID để đăng nhập",
          type: "switch",
          value: settings.biometricAuth,
          badge: "Sắp có",
        },
        {
          key: "twoFactorAuth",
          label: "Xác thực 2 bước",
          description: "Thêm lớp bảo mật bằng mã OTP",
          type: "switch",
          value: settings.twoFactorAuth,
          badge: "Sắp có",
        },
      ],
    },
  ];

  const quickActions = [
    {
      title: "Phương thức thanh toán",
      description: "Quản lý thẻ và ví điện tử",
      icon: CreditCard,
      action: () => navigate("/payment-methods"),
      badge: "Sắp có",
    },
    {
      title: "Địa chỉ giao hàng",
      description: "Quản lý địa chỉ nhận hàng",
      icon: MapPin,
      action: () => navigate("/addresses"),
      badge: "Sắp có",
    },
    {
      title: "Hỗ trợ & Trợ giúp",
      description: "Liên hệ hỗ trợ khách hàng",
      icon: HelpCircle,
      action: () => navigate("/support"),
      badge: "Sắp có",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
            <p className="text-gray-600 mt-2">
              Tùy chỉnh trải nghiệm sử dụng ứng dụng
            </p>
          </div>

          {/* Settings Categories */}
          {settingsCategories.map((category) => (
            <Card className="hover:scale-100" key={category.title}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <category.icon className="w-5 h-5 text-orange-500" />
                  <span>{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.items.map((item, index) => (
                  <div key={item.key}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Label className="text-base font-medium">
                            {item.label}
                          </Label>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs ">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </p>
                      </div>

                      <div className="ml-4 ">
                        {item.type === "switch" ? (
                          <Switch
                            checked={item.value}
                            onCheckedChange={(checked) =>
                              handleSettingChange(item.key, checked)
                            }
                            disabled={!!item.badge}
                          />
                        ) : (
                          <Select
                            value={item.value}
                            onValueChange={(value) =>
                              handleSettingChange(item.key, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {item.options?.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>
                    </div>
                    {index < category.items.length - 1 && (
                      <Separator className="mt-4  border-t border-gray-200" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}

          {/* Quick Actions */}
          <Card className="hover:scale-100">
            <CardHeader>
              <CardTitle>Tác vụ nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <div key={action.title}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-4 h-auto"
                    onClick={action.action}
                    disabled={!!action.badge}
                  >
                    <div className="flex items-center space-x-4 text-left">
                      <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                        <action.icon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{action.title}</p>
                          {action.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {action.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                  {index < quickActions.length - 1 && (
                    <Separator className="mt-4  border-t border-gray-200" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* App Info */}
          <Card className="hover:scale-100">
            <CardContent className="p-6 text-center text-sm text-gray-500">
              <p>BADAFUTA v1.0.0</p>
              <p className="mt-1">
                © 2024 BADAFUTA. Tất cả quyền được bảo lưu.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
