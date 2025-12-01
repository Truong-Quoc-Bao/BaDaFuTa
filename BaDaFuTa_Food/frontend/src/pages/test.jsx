// 1️⃣ Hàm xử lý lấy vị trí GPS (Dùng chung cho cả tự động và nút bấm)
const handleGetCurrentLocation = () => {
  // Template địa chỉ mặc định
  const defaultAddress = {
    id: Date.now(),
    full_name: user?.full_name ?? 'Người dùng',
    phone: user?.phone ?? '',
    address: 'Đang lấy vị trí...', // Hiển thị tạm để user biết đang chạy
    note: '',
    utensils: '',
    lat: 0,
    lng: 0,
  };

  // Nếu đang ở chế độ sửa, cập nhật UI ngay để user thấy phản hồi
  if (isEditing) {
     setFormData(prev => ({...prev, address: 'Đang tìm vị trí...'}));
  }

  // Hàm gọi API lấy tên đường
  const fetchAddressName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      );
      const data = await res.json();
      
      const gpsAddress = {
        ...defaultAddress,
        // Giữ lại tên/sđt nếu người dùng đang nhập dở
        full_name: formData.full_name || defaultAddress.full_name,
        phone: formData.phone || defaultAddress.phone,
        address: data.display_name || 'Vị trí hiện tại',
        lat,
        lng: lon,
      };

      // Cập nhật State
      setFormData(gpsAddress);
      setSelectedAddress(gpsAddress);
      
      // 🔥 Lưu ngay vào LocalStorage để F5 không mất
      localStorage.setItem(`selectedAddress_${user?.id}`, JSON.stringify(gpsAddress));

    } catch (err) {
      console.error('Lỗi lấy tên đường:', err);
      // Nếu lỗi API thì vẫn lưu tọa độ
      const fallbackAddr = { ...defaultAddress, lat, lng: lon, address: `Toạ độ: ${lat}, ${lon}` };
      setFormData(fallbackAddr);
      setSelectedAddress(fallbackAddr);
    }
  };

  // Gọi trình duyệt lấy GPS
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchAddressName(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        console.warn('GPS bị từ chối:', err.message);
        setIsEditing(true);
        const emptyAddr = { ...defaultAddress, address: '' };
        setFormData(emptyAddr);
        setSelectedAddress(emptyAddr);
        alert("Không thể lấy vị trí. Vui lòng kiểm tra quyền GPS hoặc nhập tay.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    console.warn('Geolocation không hỗ trợ');
    setIsEditing(true);
    const emptyAddr = { ...defaultAddress, address: '' };
    setFormData(emptyAddr);
    setSelectedAddress(emptyAddr);
  }
};

// 2️⃣ useEffect: Chỉ chạy tự động nếu CHƯA CÓ địa chỉ
useEffect(() => {
  if (!user) return;

  // Load danh sách cũ
  const savedAddresses = JSON.parse(localStorage.getItem(`addressList_${user.id}`)) || [];
  setAddressList(savedAddresses);

  // Load địa chỉ đang chọn
  const savedSelected = JSON.parse(localStorage.getItem(`selectedAddress_${user.id}`));

  if (savedSelected) {
    console.log('📦 Dùng địa chỉ đã lưu:', savedSelected);
    setSelectedAddress(savedSelected);
    setFormData(savedSelected);
    return; // ⛔ Có rồi thì DỪNG, không tự chạy GPS
  }

  // ⛔ Nếu chưa có thì mới tự động chạy GPS lần đầu
  console.log('🌍 Chưa có địa chỉ, tự động lấy GPS...');
  handleGetCurrentLocation();
}, [user]);

{/* ... Code cũ ... */}
<p className="flex items-start gap-2 text-sm text-gray-500">
  <MapPin className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
  <span className="flex flex-col w-full"> 
    
    {/* Phần hiển thị địa chỉ / Input */}
    <span className="flex flex-wrap items-center">
        <span>Địa chỉ giao hàng: &nbsp;</span>
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
            {selectedAddress?.address || 'Chưa có địa chỉ'}
          </span>
        )}
    </span>

    {/* 🔥 NÚT LẤY VỊ TRÍ HIỆN TẠI (Thêm vào đây) */}
    <Button 
        variant="ghost" 
        size="sm" 
        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 h-auto font-normal mt-2 w-fit flex items-center gap-1"
        onClick={handleGetCurrentLocation} // 👈 Gọi hàm khi bấm
    >
        <LocateFixed className="w-4 h-4" />
        Lấy vị trí hiện tại
    </Button>

  </span>
</p>
{/* ... Code cũ ... */}