import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button"
import { ArrowLeft, CreditCard, MapPin, Phone, User, Edit, Plus } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {Textarea} from "../components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useCart } from "../contexts/CartContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

export default function CheckOutPage () {
  // 🧩 Lấy user từ AuthContext
  const { state: authState } = useAuth();
  const user = authState.user;

  // 🛒 Lấy giỏ hàng
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const deliveryFee =
    state.items.length > 0
      ? state.items[0].restaurant?.deliveryFee ??
        state.items[0].restaurant?.delivery_fee ??
        0
      : 0;

  const subtotal = state.total;
  const total = subtotal + deliveryFee;

  const [step, setStep] = useState("list"); // list | edit | add

  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 🧠 STATE QUẢN LÝ
  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
    
    const handleSelectAddress = (addr) => {
      setSelectedAddress(addr);
      setFormData(addr);
      localStorage.setItem("selectedAddress", JSON.stringify(addr)); // ✅ lưu vào localStorage
      setIsDialogOpen(false);
    };

    
  // useEffect(() => {
  //   if (!user) return;

  //   // 1️⃣ Hiển thị ngay địa chỉ mặc định từ user
  //   if (user) {
  //     const defaultAddress = {
  //       id: 1,
  //       full_name: user.full_name,
  //       phone: user.phone,
  //       address: user.address,
  //       note: user.note,
  //     };

  //     const savedAddresses = [
  //       {
  //         id: 2,
  //         full_name: "Nguyễn Văn A",
  //         phone: "0912345678",
  //         address: "123 Đường ABC, Quận 1, TP.HCM",
  //         note: "Giao giờ hành chính",
  //       },
  //       {
  //         id: 3,
  //         full_name: "Trần Thị B",
  //         phone: "0987654321",
  //         address: "456 Đường XYZ, Quận 3, TP.HCM",
  //         note: "",
  //       },
  //     ];

  //     //   setAddressList([defaultAddress]);
  //     //   setSelectedAddress(defaultAddress);
  //     setAddressList([defaultAddress, ...savedAddresses]);
  //     setSelectedAddress(defaultAddress);
  //   }
  //   // 2️⃣ Lấy vị trí tự động background
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       async (position) => {
  //         const { latitude, longitude } = position.coords;
  //         console.log("📍 Vị trí hiện tại:", latitude, longitude);

  //         try {
  //           const res = await fetch(
  //             `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
  //           );
  //           const data = await res.json();
  //           const fullAddress = data.display_name || user?.address || "";

  //           // Cập nhật state mà không block render
  //           setFormData((prev) => ({ ...prev, address: fullAddress }));
  //           setSelectedAddress((prev) => ({ ...prev, address: fullAddress }));
  //         } catch (err) {
  //           console.log("❌ Không thể lấy địa chỉ tự động:", err);
  //         }
  //       },
  //       (err) => {
  //         console.warn("⚠️ Lỗi khi lấy vị trí:", err.message);
  //       },
  //       {
  //         enableHighAccuracy: true,
  //         timeout: 10000,
  //         maximumAge: 0,
  //       }
  //     );
  //   } else {
  //     console.warn("⚠️ Trình duyệt không hỗ trợ Geolocation.");
  //   }
  // }, [user]);

useEffect(() => {
  if (!user) return;

  const fetchAddress = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      const fullAddress = data.display_name || user?.address || "";

      setFormData((prev) => ({ ...prev, address: fullAddress }));
      setSelectedAddress((prev) => ({ ...prev, address: fullAddress }));
    } catch (err) {
      console.log("❌ Không thể lấy địa chỉ tự động:", err);
    }
  };

  const fallbackPosition = { latitude: 12.2388, longitude: 109.1967 }; // Nha Trang

  if ("geolocation" in navigator) {
    // Lấy thật khi HTTPS hoặc localhost
    if (
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost"
    ) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchAddress(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.warn("⚠️ Lỗi khi lấy vị trí, dùng fallback:", err.message);
          fetchAddress(fallbackPosition.latitude, fallbackPosition.longitude);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.warn("⚠️ Không lấy được vị trí thật trên LAN, dùng fallback");
      fetchAddress(fallbackPosition.latitude, fallbackPosition.longitude);
    }
  } else {
    console.warn("⚠️ Trình duyệt không hỗ trợ Geolocation.");
    fetchAddress(fallbackPosition.latitude, fallbackPosition.longitude);
  }

  const defaultAddress = {
    id: 1,
    full_name: user.full_name,
    phone: user.phone,
    address: user.address,
    note: user.note,
  };
  setAddressList([defaultAddress]);
  setSelectedAddress(defaultAddress);
}, [user]);

  

  // 🧾 Hàm thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✏️ Chỉnh sửa địa chỉ hiện tại
  const handleEdit = () => {
    setIsDialogOpen(true);
    setIsEditing(false);
    setIsAdding(false);
  };

  // ➕ Thêm địa chỉ mới

  const handleAddNewAddress = () => {
    setIsAdding(true);
    setIsEditing(false);
    setFormData({ name: "", phone: "", address: "", note: "" });
    setIsDialogOpen(true); // 👈 mở popup
  };

  // 💾 Lưu khi chỉnh sửa
  const handleSaveEdit = () => {
    setAddressList((prev) =>
      prev.map((addr) =>
        addr.id === selectedAddress.id ? { ...formData, id: addr.id } : addr
      )
    );
    setSelectedAddress(formData);
    localStorage.setItem("selectedAddress", JSON.stringify(formData)); // ✅ cập nhật luôn
    setIsEditing(false);
    alert("✅ Đã cập nhật thông tin giao hàng!");
  };


  // 💾 Lưu khi thêm mớ
   const handleSaveAdd = () => {
      const newAddress = { ...formData, id: Date.now() };
      setAddressList((prev) => [...prev, newAddress]);
      setSelectedAddress(newAddress);
      localStorage.setItem("selectedAddress", JSON.stringify(newAddress)); // ✅ lưu
      setIsAdding(false);
      alert("✅ Đã thêm địa chỉ mới!");
    };
   

  if (!user) return <p>Đang tải thông tin người dùng...</p>;
  if (!selectedAddress) return <p>Đang tải địa chỉ giao hàng...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="outline"
        onClick={() => navigate("/cart")}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại giỏ hàng
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card className="mb-6  hover:scale-100">

            <CardHeader className="flex justify-between items-center">
              <CardTitle>Thông tin giao hàng</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleEdit} // 👈 mở popup chỉnh sửa
                >
                  Chọn lại địa chỉ
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold">{selectedAddress?.full_name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedAddress?.phone}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedAddress?.address}
                  </p>
                </div>
              </div>

              {/* Popup danh sách địa chỉ */}
              {/* Popup sửa hoặc thêm địa chỉ */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditing
                        ? "Chỉnh sửa địa chỉ giao hàng"
                        : isAdding
                        ? "Thêm địa chỉ mới"
                        : "Quản lý địa chỉ"}
                    </DialogTitle>
                  </DialogHeader>

                  {/* 🧩 Nếu đang chỉnh sửa hoặc thêm mới thì chỉ hiển thị form */}
                  {isEditing || isAdding ? (
                    <div className="space-y-4">
                      {/* Nút quay lại */}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setIsAdding(false);
                        }}
                        className="w-[4px] h-[4px] border-0"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Button>
                      <div>
                        <Label>Họ tên</Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Nhập họ tên người nhận"
                        />
                      </div>

                      <div>
                        <Label>Số điện thoại</Label>
                        <Input
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>

                      <div>
                        <Label>Địa chỉ</Label>
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Nhập địa chỉ giao hàng"
                        />
                      </div>

                      <div>
                        <Label>Ghi chú</Label>
                        <Textarea
                          name="note"
                          value={formData.note}
                          onChange={handleInputChange}
                          placeholder="Ghi chú (nếu có)"
                        />
                      </div>

                      <DialogFooter className="flex justify-between mt-4">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            setIsAdding(false);
                          }}
                        >
                          Hủy
                        </Button>
                        <Button
                          variant="outline"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={isEditing ? handleSaveEdit : handleSaveAdd}
                        >
                          {isEditing ? "Lưu thay đổi" : "Thêm địa chỉ"}
                        </Button>
                      </DialogFooter>
                    </div>
                  ) : (
                    // 🧾 Hiển thị danh sách địa chỉ nếu chưa bấm sửa hoặc thêm
                    <>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        className="w-[4px] h-[4px] border-0"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                      </Button>
                      <div className="space-y-4 mt-4 max-h-[400px] overflow-y-auto">
                        {addressList.map((addr) => (
                          <div
                            key={addr.id}
                            className={`flex justify-between items-start border rounded-lg p-3 cursor-pointer ${
                              selectedAddress?.id === addr.id
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200"
                            }`}
                            onClick={() => {
                              // 1️⃣ Cập nhật selectedAddress
                              setSelectedAddress(addr);

                              // 2️⃣ Đánh dấu cái này là mặc định
                              setAddressList((prev) =>
                                prev.map((a) => ({
                                  ...a,
                                  isDefault: a.id === addr.id, // ✅ chỉ cái được click là mặc định
                                }))
                              );

                              // 3️⃣ Lưu vào localStorage
                              localStorage.setItem(
                                "selectedAddress",
                                JSON.stringify({ ...addr, isDefault: true })
                              );
                            }}
                          >
                            <div>
                              {addr.isDefault && (
                                <p className="text-sm text-orange-500 font-medium mb-1">
                                  Mặt định
                                </p>
                              )}
                              <p className="font-semibold">{addr.full_name}</p>
                              <p className="text-sm text-gray-500">
                                {addr.phone}
                              </p>
                              <p className="text-sm text-gray-500">
                                {selectedAddress?.id === addr.id
                                  ? selectedAddress.address || "Chưa có địa chỉ"
                                  : addr.address || "Chưa có địa chỉ"}
                              </p>
                              {addr.note && (
                                <p className="text-sm text-gray-400 italic">
                                  Ghi chú: {addr.note}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col space-y-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setFormData(addr);
                                  setIsEditing(true);
                                  setIsAdding(false);
                                }}
                              >
                                <Edit className="w-4 h-4 mr-1" /> Sửa
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ➕ Nút thêm địa chỉ mới */}
                      <div className="flex justify-center mt-4">
                        <Button
                          variant="outline"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={() => {
                            setIsAdding(true);
                            setIsEditing(false);
                            setFormData({
                              name: "",
                              phone: "",
                              address: "",
                              note: "",
                            });
                          }}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Thêm địa chỉ mới
                        </Button>
                      </div>

                      {/* <DialogFooter>
                        
                      </DialogFooter> */}
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter>
              <Button
                variant="default"
                className="bg-orange-600 hover:bg-orange-700 w-[200px] flex justify-start text-white"
                onClick={() => {
                  setIsAdding(true);
                  setIsEditing(false);
                  setFormData({
                    name: "",
                    phone: "",
                    address: "",
                    note: "",
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-1" /> Thêm địa chỉ mới
              </Button>
            </CardFooter>
          </Card>

          <div className="mb-6">
            {/* <PaymentMethodSelector 
              onSelect={handlePaymentMethodSelect}
              selectedMethod={selectedPaymentMethod}
            /> */}
            <p className="font-semibold flex items-center">
              <CreditCard className="w-5 h-5 mr-2" /> Phương thức thanh toán
            </p>
          </div>

          <div className="flex space-x-3">
            <Button
              //   onClick={handleSubmit}
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              size="lg"
              //   disabled={!selectedPaymentMethod}
            >
              đặt hàng
              {/* {selectedPaymentMethod?.type === 'cash' ? 'Đặt hàng' : 'Tiếp tục thanh toán'} */}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
              size="lg"
            >
              Hủy
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 hover:scale-100">
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div className="space-y-3">
                {state.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <ImageWithFallback
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="object-cover w-[40px] h-[40px] p-1  rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.menuItem.name}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x{" "}
                        {item.menuItem.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                    <span className="font-medium">
                      {(item.menuItem.price * item.quantity).toLocaleString(
                        "vi-VN"
                      )}
                      đ
                    </span>
                  </div>
                ))}
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between">
                <span>
                  Tạm tính (
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  món)
                </span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>

              <div className="flex justify-between">
                <span>Phí giao hàng</span>
                <span>{deliveryFee.toLocaleString("vi-VN")}đ</span>
              </div>

              <hr className="border-gray-200" />

              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-orange-600">
                  {state.items
                    .reduce(
                      (total, i) => total + i.menuItem.price * i.quantity,
                      0
                    )
                    .toLocaleString("vi-VN")}
                  đ
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}







