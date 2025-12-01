// 🔹 Hàm tính phí giao hàng
function calculateDeliveryFee(distance) {
  // distance tính theo km
  if (distance <= 3) return 16000;
  return 16000 + Math.ceil(distance - 3) * 4000;
}

// 🔹 Hàm tính thời gian giao hàng (phút)
function calculateDeliveryTime(distance) {
  return Math.max(10, Math.round(distance * 8));
}

export default function CheckOutPage() {
  const socketRef = useRef(null);
  const { state: authState } = useAuth();
  const user = authState.user;

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const { state, updateQuantity, removeItem, clearCart } = useCart();

  const [addressList, setAddressList] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [voucherPopup, setVoucherPopup] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);

  const merchant =
    state.items.length > 0
      ? state.items[0].restaurant || state.items[0].merchant
      : null;

  let distanceKm = 0;
  let deliveryFee = 0;
  let deliveryTime = 0;

  if (merchant && selectedAddress) {
    distanceKm = getDistanceKm(
      merchant.lat,
      merchant.lng,
      selectedAddress.lat,
      selectedAddress.lng
    );
    deliveryFee = calculateDeliveryFee(distanceKm);
    deliveryTime = calculateDeliveryTime(distanceKm);
  }

  console.log("Distance (km):", distanceKm);
  console.log("Delivery Fee (VND):", deliveryFee);
  console.log("Estimated Delivery Time (min):", deliveryTime);

  return (
    <div>
      {/* Ví dụ hiển thị phí ship và thời gian giao */}
      <p>Delivery Fee: {deliveryFee} VND</p>
      <p>Estimated Delivery Time: {deliveryTime} minutes</p>
      {/* Các phần khác của CheckOutPage */}
    </div>
  );
}
