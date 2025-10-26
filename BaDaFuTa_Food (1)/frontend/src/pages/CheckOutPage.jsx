import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { Button } from "../components/ui/button"
import { ArrowLeft, CreditCard, MapPin, Phone, User, Edit, Plus, Edit3, FileText} from "lucide-react";
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
import { Clock } from "lucide-react";


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
    full_name: "",
    phone: "",
    address: "",
    note: "",
  });

  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    setFormData(addr);
    localStorage.setItem(`selectedAddress_${user?.id}`, JSON.stringify(addr));
    setIsDialogOpen(false);
  };

  const noteRef = useRef(formData.note || "");
  const [note, setNote] = useState(formData.note || "");

  const handleConfirmNote = () => {
    console.log("📝 Ghi chú đã xác nhận:", noteRef.current);
  };

  // useEffect(() => {
  //   if (!user) return;

  //   // ✅ Kiểm tra localStorage trước
  //  const savedAddress = JSON.parse(
  //    localStorage.getItem(`selectedAddress_${user?.id}`)
  //  );

  //   if (savedAddress) {
  //     setAddressList([savedAddress]);
  //     setSelectedAddress(savedAddress);
  //     setFormData(savedAddress);
  //     return;
  //   }

  //   const defaultAddress = {
  //     id: 1,
  //     full_name: user?.full_name ?? "Người dùng",
  //     phone: user?.phone ?? "",
  //     address: "", // để trống nếu user từ chối GPS
  //     note: user?.note ?? "",
  //   };

  //   setAddressList([defaultAddress]);
  //   setSelectedAddress(defaultAddress);
  //   setFormData((prev) => ({ ...prev, address: defaultAddress.address }));

  //   // Hàm fetch địa chỉ từ lat/lon
  //   const fetchAddress = async (lat, lon) => {
  //     try {
  //       const res = await fetch(
  //         `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  //       );
  //       const data = await res.json();
  //       const fullAddress = data.display_name || defaultAddress.address;

  //       setFormData((prev) => ({ ...prev, address: fullAddress }));
  //       setSelectedAddress((prev) => ({ ...prev, address: fullAddress }));
  //     } catch (err) {
  //       console.log("Reverse geocode error:", err);
  //     }
  //   };

  //   // Lấy GPS nếu trình duyệt hỗ trợ
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (pos) => fetchAddress(pos.coords.latitude, pos.coords.longitude),
  //       (err) => {
  //         // console.warn("GPS fail, fallback IP:", err.message);
  //         // fetchAddressByIP();
  //         console.warn("GPS bị từ chối:", err.message);
  //         // hiển thị input trực tiếp
  //         setIsEditing(true);
  //         setFormData(defaultAddress); // input trống để user nhập
  //       },
  //       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  //     );
  //   } else {
  //     console.warn("Geolocation không hỗ trợ");
  //     setIsEditing(true); // bật nhập thủ công
  //     setIsAdding(false);
  //     setFormData(defaultAddress);
  //     setIsDialogOpen(true);

  //     // console.warn("Geolocation not supported, fallback IP");
  //     // fetchAddressByIP();
  //   }
  // }, [user]);

  useEffect(() => {
    if (!user) return;

    // ✅ Lấy danh sách địa chỉ cũ từ localStorage
    const savedAddresses =
      JSON.parse(localStorage.getItem(`addressList_${user.id}`)) || [];

    setAddressList(savedAddresses);

    const defaultAddress = {
      id: Date.now(),
      full_name: user?.full_name ?? "Người dùng",
      phone: user?.phone ?? "",
      address: "", // để trống nếu GPS bị từ chối
      note: "",
    };

    // Hàm fetch địa chỉ từ GPS
    const fetchAddress = async (lat, lon) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        const data = await res.json();
        const gpsAddress = {
          ...defaultAddress,
          address: data.display_name || "",
        };
        setFormData(gpsAddress);
        setSelectedAddress(gpsAddress);
      } catch (err) {
        console.log("Reverse geocode error:", err);
        setFormData(defaultAddress);
        setSelectedAddress(defaultAddress);
      }
    };

    // Lấy GPS nếu trình duyệt hỗ trợ
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchAddress(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          console.warn("GPS bị từ chối:", err.message);
          // hiển thị input trống
          setIsEditing(true);
          setFormData(defaultAddress);
          setSelectedAddress(defaultAddress);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      console.warn("Geolocation không hỗ trợ");
      setIsEditing(true);
      setFormData(defaultAddress);
      setSelectedAddress(defaultAddress);
    }
  }, [user]);


const [showConfirmPopup, setShowConfirmPopup] = useState(false);
const [countdown, setCountdown] = useState(20);

  const handleSaveOnCheckout = () => {
    const newAddress = { ...formData, id: Date.now() };

    // Tính thời gian dự kiến giao hàng: 35-40 phút
    const now = new Date();
    const minutesToAdd = Math.floor(Math.random() * 6) + 35;
    const estimatedTime = new Date(now.getTime() + minutesToAdd * 60000);
    // Gán estimatedTime ngay vào address
    const finalAddress = { ...newAddress, estimatedTime };

    const isExisting = addressList.some(
      (addr) =>
        addr.full_name === newAddress.full_name &&
        addr.phone === newAddress.phone &&
        addr.address === newAddress.address
    );

    // Hiển thị popup xác nhận
    setSelectedAddress(finalAddress); // ✅ gán ngay để popup show thời gian
    setShowConfirmPopup(true);
    setCountdown(20); // reset countdown

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowConfirmPopup(false);

          if (!isExisting) {
            // Lưu địa chỉ mới
            const updatedList = [...addressList, finalAddress];
            setAddressList(updatedList);
            localStorage.setItem(
              `addressList_${user.id}`,
              JSON.stringify(updatedList)
            );
            setSelectedAddress(newAddress);
            alert("✅ Địa chỉ mới đã được lưu vào danh sách địa chỉ cũ!");
          } else {
            // Dùng lại địa chỉ cũ
            // setSelectedAddress(
            //   addressList.find(
            //     (addr) =>
            //       addr.full_name === newAddress.full_name &&
            //       addr.phone === newAddress.phone &&
            //       addr.address === newAddress.address
            //   )
            // );
            // alert("✅ Đang sử dụng địa chỉ cũ, không lưu trùng!");
            const existingAddr = addressList.find(
              (addr) =>
                addr.full_name === newAddress.full_name &&
                addr.phone === newAddress.phone &&
                addr.address === newAddress.address
            );
            setSelectedAddress({ ...existingAddr, estimatedTime });
            // alert("✅ Đang sử dụng địa chỉ cũ, không lưu trùng!");
          }

          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };



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
    setFormData({ full_name: "", phone: "", address: "", note: "" });
    setIsDialogOpen(true); // 👈 mở popup
  };

  // 💾 Lưu khi chỉnh sửa
  const handleSaveEdit = () => {
    setAddressList((prev) =>
      prev.map((addr) =>
        addr.id === selectedAddress.id ? { ...formData, id: addr.id } : addr
      )
    );

    const updatedAddress = {
      ...formData,
      id: selectedAddress?.id ?? Date.now(),
    };
    setSelectedAddress(updatedAddress);

    localStorage.setItem(
      `selectedAddress_${user?.id}`,
      JSON.stringify(updatedAddress)
    );

    setIsEditing(false);
    alert("✅ Đã cập nhật thông tin giao hàng!");
  };

  // 💾 Lưu khi thêm mớ
  const handleSaveAdd = () => {
    const newAddress = { ...formData, id: Date.now() };
    setAddressList((prev) => [...prev, newAddress]);
    setSelectedAddress(newAddress);
    localStorage.setItem(
      `selectedAddress_${user?.id}`,
      JSON.stringify(newAddress)
    );
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
            <CardHeader className="font-semibold text-2xl flex justify-between items-center">
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
              <div className="flex justify-between items-start p-4 rounded-xl border border-gray-200 bg-white shadow-sm mb-4">
                <div className="space-y-2 w-full">
                  <p className="text-base font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" />
                    <span>Địa chỉ giao hàng mặc định</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4 text-accent" />
                    <span>Tên khách hàng: </span>
                    <span className="font-semibold text-gray-900">
                      {selectedAddress?.full_name || "Người dùng"}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone className="w-4 h-4 text-accent" />
                    <span> Số điện thoại giao hàng: </span>
                    <span className="font-semibold text-gray-900">
                      {selectedAddress?.phone || ""}
                    </span>
                  </p>

                  {/* Địa chỉ giao hàng */}
                  <p className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="flex flex-wrap w-full">
                      <span>Địa chỉ giao hàng: &nbsp;</span>{" "}
                      {/* Nếu đang edit địa chỉ (GPS bị từ chối) thì hiện input */}
                      {isEditing || !selectedAddress.address ? (
                        <Input
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Nhập địa chỉ giao hàng"
                          className="font-semibold text-gray-900 break-words"
                        />
                      ) : (
                        <span className="font-semibold text-gray-900 break-words">
                          {" "}
                          {selectedAddress?.address || "Chưa có địa chỉ"}
                        </span>
                      )}
                    </span>
                  </p>

                  {/* 📝 Ghi chú giao hàng */}
                  <div className="w-full space-y-2">
                    <p className="flex items-center gap-2 text-sm text-gray-500">
                      <Edit3 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>Ghi chú giao hàng: </span>
                    </p>
                    <Textarea
                      placeholder="Nhập ghi chú cho đơn hàng (VD: Giao buổi sáng, gọi trước khi tới...)"
                      value={formData.note} // ✅ bind trực tiếp với formData
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          note: e.target.value,
                        }));
                        setSelectedAddress((prev) => ({
                          ...prev,
                          note: e.target.value,
                        }));
                      }}
                      className="w-full min-h-[90px] font-semibold text-gray-500 break-words resize-none"
                    />
                  </div>

                  {/* <div className="mt-3 flex">
                    <Button className="" onClick={handleConfirmNote}>
                      Xác nhận
                    </Button>
                  </div> */}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormData(selectedAddress); // ✅ nạp dữ liệu đang chọn
                      setIsEditing(true); // ✅ bật chế độ sửa
                      setIsAdding(false);
                      setIsDialogOpen(true); // ✅ mở popup
                    }}
                  >
                    <Edit /> Sửa
                  </Button>
                </div>
              </div>

              {/* Popup danh sách địa chỉ */}
              {/* Popup sửa hoặc thêm địa chỉ */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg border border-gray-200 rounded-lg">
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
                          name="full_name"
                          value={formData.full_name}
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
                                  // setFormData(addr);
                                  setFormData(selectedAddress); // ✅ nạp dữ liệu đang chọn
                                  setIsEditing(true);
                                  setIsAdding(false);
                                  setIsDialogOpen(true); // ✅ mở popup sửa
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
                  setIsDialogOpen(true); // ✅ thêm dòng này để hiện popup
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
              onClick={handleSaveOnCheckout}
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
        {showConfirmPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Overlay mờ nền */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Popup chính */}
            <div className="relative bg-white p-6 rounded-lg text-center z-10 max-w-md w-full mx-4 shadow-lg">
              {/* Countdown */}
              <div className="relative w-32 h-32 mx-auto">
                {/* Vòng tròn gradient xoay */}
                <div className="absolute inset-0 rounded-full border-8 border-gray-300 border-t-transparent border-r-transparent border-b-orange-400 border-l-orange-600 animate-spin"></div>

                {/* Đuôi sáng nhỏ dạng comet */}
                {/* <div className="absolute top-1 left-1/2 w-2 h-8 bg-gradient-to-b from-orange-500 to-transparent rounded-full transform -translate-x-1/2 animate-spin"></div> */}

                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full shadow-[0_0_25px_rgba(255,165,0,0.8)]"></div>

                {/* Countdown ở giữa */}
                <p className="absolute inset-0 flex items-center justify-center text-[32px] font-bold text-red-500 drop-shadow-lg">
                  ({countdown}s)
                </p>
              </div>

              {/* Tiêu đề */}
              <p className="text-lg font-semibold mb-4">Xác nhận đặt đơn</p>

              {/* Nội dung */}
              <p className="text-gray-700 mb-4">
                Bạn ơi, hãy kiểm tra thông tin lần nữa nhé!
              </p>

              {/* Thông tin địa chỉ */}
              <div className="flex flex-col gap-4 text-gray-700">
                {/* Thẻ địa chỉ */}
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                  <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col w-full">
                    <span className="font-semibold text-gray-900 break-words">
                      {selectedAddress?.address || "Chưa có địa chỉ"}
                    </span>
                    <p className="text-gray-600 text-sm mt-1">
                      {selectedAddress?.full_name} | {selectedAddress?.phone}
                    </p>
                  </div>
                </div>

                {/* Thời gian dự kiến */}
                {selectedAddress?.estimatedTime &&
                  new Date(selectedAddress.estimatedTime) > new Date() && (
                    <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg border border-yellow-200">
                      <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <span className="font-semibold text-yellow-700">
                        Dự kiến giao lúc:{" "}
                        {new Date(
                          selectedAddress.estimatedTime
                        ).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}

                {/* Danh sách món */}
                <div className="flex flex-col gap-3">
                  {state.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                    >
                      <FileText className="w-5 h-5 text-orange-500 flex-shrink-0" />
                      <ImageWithFallback
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="object-cover w-12 h-12 rounded-lg flex-shrink-0"
                      />
                      <div className="flex flex-col truncate">
                        <span className="font-semibold text-gray-900 truncate">
                          {item.menuItem.name}
                        </span>
                        <span className="text-sm text-gray-500 truncate">
                          {item.quantity} món |{" "}
                          {item.menuItem.price.toLocaleString("vi-VN")}đ | Tiền
                          mặt
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  onClick={() => {
                    // Xử lý khi bấm chỉnh sửa
                    console.log("Chỉnh sửa");
                  }}
                >
                  Chỉnh sửa
                </Button>
                <Button
                  variant="default"
                  className="px-4 py-2 w-[120px] bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  onClick={() => {
                    // Xử lý khi bấm xác nhận
                    console.log("Xác nhận");
                  }}
                >
                  Xác nhận
                </Button>
              </div>
            </div>
          </div>
        )}

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







