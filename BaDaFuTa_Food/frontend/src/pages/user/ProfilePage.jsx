import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // 🔹 import auth
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avartar";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Alert, AlertDescription } from "../../components/ui/alert";

export const ProfilePage = () => {
  const { state, updateUser } = useAuth();
  const user = state.user;

//   const { state, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editData, setEditData] = useState({
    name: state.user?.full_name || "",
    email: state.user?.email || "",
    phone: state.user?.phone || "",
    address: state.user?.address || "",
    dateOfBirth: state.user?.dateOfBirth || "",
    gender: state.user?.gender || "",
  });

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user in auth context
      if (state.user) {
        updateUser({
          ...state.user,
          ...editData,
        });
      }

      setSuccess("Thông tin đã được cập nhật thành công!");
      setIsEditing(false);
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật thông tin");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: state.user?.full_name || "",
      email: state.user?.email || "",
      phone: state.user?.phone || "",
      address: state.user?.address || "",
      dateOfBirth: state.user?.dateOfBirth || "",
    });
    setIsEditing(false);
    setError("");
    setSuccess("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (!state.user) {
    return (
      <div className=" bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md hover:scale-100">
          <CardContent className="p-6 text-center">
            <p>Vui lòng đăng nhập để xem thông tin cá nhân</p>
            <Button onClick={() => navigate("/login")} className="mt-4">
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
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 bg-white"
        >
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
                      src={editData.avatar || state.user?.avatar || ""}
                      alt={state.user?.full_name}
                      className="object-cover rounded-full"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-orange-300 to-orange-500 text-white font-semibold text-2xl flex items-center justify-center rounded-full">
                      {getInitials(state.user.full_name)}
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

                <h2 className="text-xl font-semibold mb-2">
                  {state.user.full_name}
                </h2>
                <p className="text-gray-600 mb-3">{state.user.email}</p>

                <Badge variant="secondary" className="mb-4">
                  {state.user.role === "customer"
                    ? "Khách hàng"
                    : "Chủ cửa hàng"}
                </Badge>

                {state.user.unfid && (
                  <div className="text-sm text-gray-500">
                    <p>UNFID: {state.user.unfid}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2">
            <Card className="hover:scale-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Thông tin cá nhân</CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
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
                      {isLoading ? "Đang lưu..." : "Lưu"}
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
                    <AlertDescription className="text-green-800">
                      {success}
                    </AlertDescription>
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
                        onChange={(e) =>
                          setEditData({ ...editData, name: e.target.value })
                        }
                        placeholder="Nhập họ và tên"
                      />
                    ) : (
                      <p className="text-gray-900 capitalize">
                        {state.user.full_name}
                      </p>
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
                        onChange={(e) =>
                          setEditData({ ...editData, email: e.target.value })
                        }
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
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        placeholder="Nhập số điện thoại"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {state.user.phone || "Chưa cập nhật"}
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
                      <p className="text-gray-900">
                        {formatDate(state.user.dateOfBirth || "")}
                      </p>
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
                      onChange={(e) =>
                        setEditData({ ...editData, address: e.target.value })
                      }
                      placeholder="Nhập địa chỉ"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {state.user.address || "Chưa cập nhật"}
                    </p>
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
                          checked={editData.gender === "male"}
                          onChange={(e) =>
                            setEditData({ ...editData, gender: e.target.value })
                          }
                        />
                        <span>Nam</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={editData.gender === "female"}
                          onChange={(e) =>
                            setEditData({ ...editData, gender: e.target.value })
                          }
                        />
                        <span>Nữ</span>
                      </label>

                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="gender"
                          value="other"
                          checked={editData.gender === "other"}
                          onChange={(e) =>
                            setEditData({ ...editData, gender: e.target.value })
                          }
                        />
                        <span>Khác</span>
                      </label>
                    </div>
                  ) : (
                    <p className="text-gray-900">
                      {state.user.gender === "male"
                        ? "Nam"
                        : state.user.gender === "female"
                        ? "Nữ"
                        : state.user.gender === "other"
                        ? "Khác"
                        : "Chưa cập nhật"}
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
