// CartContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
// import { toast } from "sonner";
// import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";

const STORAGE_KEY = "app_cart_v1";

// ===== Helpers =====
const normalizeRestaurant = (r) => {
  if (!r) return null;
  return {
    id: r.id ?? r.restaurant_id ?? r.merchant_id ?? r.merchant?.id ?? null,
    name:
      r.name ?? r.restaurant_name ?? r.merchant_name ?? r.merchant?.name ?? "",
    deliveryFee:
      r.deliveryFee ??
      r.delivery_fee ??
      r.merchant?.deliveryFee ??
      r.merchant?.delivery_fee ??
      0,
    raw: r,
  };
};

const normalizeMenuItem = (mi) => {
  if (!mi) return null;
  return {
    ...mi,
    price: Number(mi.price) || 0,
    originalPrice: mi.originalPrice
      ? Number(mi.originalPrice) || mi.originalPrice
      : mi.originalPrice,
    id: mi.id ?? mi.item_id ?? null,
  };
};

const recalcTotal = (items = []) =>
  items.reduce((sum, item) => {
    const toppingsTotal = (item.selectedToppings || []).reduce(
      (t, top) => t + (Number(top.price) || 0),
      0
    );
    const price = (Number(item.menuItem.price) || 0) + toppingsTotal;
    return sum + price * (item.quantity || 0);
  }, 0);

const mergeCarts = (
  base = { items: [], total: 0 },
  added = { items: [], total: 0 }
) => {
  const items = [...(base.items || [])];

  const toppingsKey = (toppingsArr) =>
    (toppingsArr || [])
      .map((t) => String(t.id))
      .sort()
      .join("|");

  for (const newIt of added.items || []) {
    const found = items.find(
      (it) =>
        String(it.menuItem.id) === String(newIt.menuItem.id) &&
        toppingsKey(it.selectedToppings) ===
          toppingsKey(newIt.selectedToppings) &&
        (it.specialInstructions || "") === (newIt.specialInstructions || "") &&
        String(it.restaurant?.id) === String(newIt.restaurant?.id)
    );

    if (found) {
      found.quantity = (found.quantity || 0) + (newIt.quantity || 0);
    } else {
      items.push({
        ...newIt,
        id:
          newIt.id ?? `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      });
    }
  }

  return { items, total: recalcTotal(items) };
};

// ===== Reducer =====
// const initialCart = { items: [], total: 0 };
const initialCart = { items: [], total: 0, toastInfo: null };

const cartReducer = (state = initialCart, action) => {
  const safeState = state || initialCart;

  switch (action.type) {
    case "HYDRATE":
      return action.payload || initialCart;

    case "ADD_ITEM": {
      const {
        menuItem: rawMenuItem,
        restaurant: rawRestaurant,
        selectedToppings = [],
        specialInstructions = "",
        quantity = 1,
      } = action.payload;
      const menuItem = normalizeMenuItem(rawMenuItem);
      const restaurant = normalizeRestaurant(rawRestaurant);

      const normalizedToppings = (selectedToppings || []).map((t) => ({
        id: t.id ?? t.topping_id ?? JSON.stringify(t),
        name: t.name ?? t.label ?? "",
        price: Number(t.price) || 0,
        raw: t,
      }));

      const toppingsKey = (toppingsArr) =>
        (toppingsArr || [])
          .map((t) => String(t.id))
          .sort()
          .join("|");

      const items = safeState.items ? [...safeState.items] : [];

      // Clear cart if different restaurant
      if (items.length > 0 && items[0].restaurant?.id !== restaurant.id) {
        // toast.info("Thêm món mới từ nhà hàng khác → xóa món cũ");
        const newItem = {
          id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
          menuItem,
          restaurant,
          quantity,
          selectedToppings: normalizedToppings,
          specialInstructions,
        };

        return {
          items: [newItem],
          total: recalcTotal([newItem]),
          toastInfo:
            "Món từ nhà hàng khác → giỏ cũ đã bị xóa, chỉ giữ món mới.", // <--- đánh dấu
        };
      }

      const existingItem = items.find(
        (it) =>
          String(it.menuItem.id) === String(menuItem.id) &&
          toppingsKey(it.selectedToppings) ===
            toppingsKey(normalizedToppings) &&
          (it.specialInstructions || "") === specialInstructions &&
          String(it.restaurant?.id) === String(restaurant?.id)
      );

      if (existingItem) {
        const updatedItems = items.map((it) =>
          it.id === existingItem.id
            ? { ...it, quantity: (it.quantity || 0) + quantity }
            : it
        );
        // toast.success(`Cập nhật số lượng món "${menuItem.name}"`);
        return { items: updatedItems, total: recalcTotal(updatedItems) };
      }

      const newItem = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        menuItem,
        restaurant,
        quantity,
        selectedToppings: normalizedToppings,
        specialInstructions,
      };
      // toast.success(`Thêm món "${menuItem.name}" vào giỏ`);
      return {
        items: [...items, newItem],
        total: recalcTotal([...items, newItem]),
      };
    }

    case "REMOVE_ITEM":
      return {
        items: (safeState.items || []).filter((it) => it.id !== action.payload),
        total: recalcTotal(
          (safeState.items || []).filter((it) => it.id !== action.payload)
        ),
      };
    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0)
        return {
          items: (safeState.items || []).filter((it) => it.id !== id),
          total: recalcTotal(
            (safeState.items || []).filter((it) => it.id !== id)
          ),
        };
      const updatedItems = (safeState.items || []).map((it) =>
        it.id === id ? { ...it, quantity } : it
      );
      return { items: updatedItems, total: recalcTotal(updatedItems) };
    }
    case "CLEAR_CART":
      return { items: [], total: 0 };
    default:
      return safeState;

    case "CLEAR_TOAST": // ✅ Thêm ở đây, trong switch
      return { ...safeState, toastInfo: null };
  }
};

// ===== Context =====
const CartContext = createContext(undefined);
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

// ===== Storage helpers =====
const getInitialState = (userId = "guest") => {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
    if (!raw) return { items: [], total: 0 };
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.items)
      ? parsed
      : { items: [], total: 0 };
  } catch (e) {
    console.warn("Failed to parse cart from localStorage:", e);
    return { items: [], total: 0 };
  }
};

// ===== Provider =====
export const CartProvider = ({ children }) => {
  const { state: authState } = useAuth();
  const userId = authState?.user?.id ?? authState?.user?._id ?? "guest";

  const hydratedRef = useRef({}); // track per user
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // Hydrate cart
  // useEffect(() => {
  //   if (authState?.isLoading) return;

  //   // Nếu user đã hydrate thì không làm gì
  //   if (hydratedRef.current[userId]) return;

  //   // Lấy cart user từ localStorage
  //   let userCart = getInitialState(userId);

  //   // Merge guest cart **chỉ khi login lần đầu** và userCart rỗng
  //   // Merge guest → user khi login
  //   if (userId !== "guest") {
  //     const guestCart = getInitialState("guest");
  //     if (guestCart.items && guestCart.items.length > 0) {
  //       const merged = mergeCarts(userCart, guestCart);
  //       try {
  //         localStorage.setItem(
  //           `${STORAGE_KEY}_${userId}`,
  //           JSON.stringify(merged)
  //         );
  //         localStorage.removeItem(`${STORAGE_KEY}_guest`); // tránh merge lại
  //       } catch (e) {
  //         console.warn(e);
  //       }
  //       dispatch({ type: "HYDRATE", payload: merged });
  //       hydratedRef.current[userId] = true;
  //       return;
  //     }
  //   }

  //   dispatch({ type: "HYDRATE", payload: userCart });
  //   hydratedRef.current[userId] = true;
  // }, [authState?.isLoading, userId]);

  useEffect(() => {
    if (state.toastInfo) {
      toast.info(state.toastInfo);
      dispatch({ type: "CLEAR_TOAST" });
    }
  }, [state.toastInfo]);

  useEffect(() => {
    if (authState?.isLoading) return;
    if (hydratedRef.current[userId]) return;

    let userCart = getInitialState(userId);

    if (userId !== "guest") {
      const guestCart = getInitialState("guest");

      if (guestCart.items && guestCart.items.length > 0) {
        // Lấy nhà hàng hiện tại của userCart (nếu có)
        const userRestaurantId = userCart.items[0]?.restaurant?.id;
        const guestRestaurantId = guestCart.items[0]?.restaurant?.id;

        let merged;
        let showToast = false;

        if (!userRestaurantId || userRestaurantId === guestRestaurantId) {
          // Cộng dồn bình thường nếu cùng nhà hàng hoặc user cart rỗng
          merged = mergeCarts(userCart, guestCart);
          if (merged.items.length > 0 && userCart.items.length === 0)
            showToast = true;
        } else {
          // Nếu khác nhà hàng → giữ **chỉ món guest** (xoá user cart cũ)
          merged = {
            items: guestCart.items,
            total: recalcTotal(guestCart.items),
          };
          showToast = true; // Thêm toast luôn
        }

        try {
          localStorage.setItem(
            `${STORAGE_KEY}_${userId}`,
            JSON.stringify(merged)
          );
          localStorage.removeItem(`${STORAGE_KEY}_guest`);
        } catch (e) {
          console.warn(e);
        }

        dispatch({ type: "HYDRATE", payload: merged });
        hydratedRef.current[userId] = true;

        if (showToast) {
          // ✅ Delay toast tới khi component mount xong
          setTimeout(() => {
            toast.info(
              userRestaurantId && userRestaurantId !== guestRestaurantId
                ? "Món từ giỏ trước khi đăng nhập khác nhà hàng → giỏ cũ đã bị xóa, chỉ giữ món mới."
                : "Các món từ giỏ trước khi đăng nhập đã được thêm vào giỏ của bạn."
            );
          }, 0);
        }

        return;
      }
    }

    dispatch({ type: "HYDRATE", payload: userCart });
    hydratedRef.current[userId] = true;
  }, [authState?.isLoading, userId]);

  // Persist cart
  useEffect(() => {
    if (!hydratedRef.current[userId]) return;
    try {
      const key = `${STORAGE_KEY}_${userId}`;
      const raw = localStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : null;
      const needWrite =
        !existing ||
        JSON.stringify(existing.items) !== JSON.stringify(state.items) ||
        existing.total !== state.total;
      if (needWrite) localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.warn(e);
    }
  }, [state, userId]);

  // Logout
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: "CLEAR_CART" });
      hydratedRef.current[userId] = false;
    };
    window.addEventListener("user-logged-out", handleLogout);
    return () => window.removeEventListener("user-logged-out", handleLogout);
  }, [userId]);

  // Actions
  const addItem = (menuItem, restaurant, quantity = 1) =>
    dispatch({ type: "ADD_ITEM", payload: { menuItem, restaurant, quantity } });
  const addItemWithToppings = (
    menuItem,
    restaurant,
    selectedToppings = [],
    specialInstructions = "",
    quantity = 1
  ) =>
    dispatch({
      type: "ADD_ITEM",
      payload: {
        menuItem,
        restaurant,
        selectedToppings,
        specialInstructions,
        quantity,
      },
    });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        addItemWithToppings,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};








  
useEffect(() => {
  if (!user) return;

  // ✅ Kiểm tra localStorage trước
 const savedAddress = JSON.parse(
   localStorage.getItem(`selectedAddress_${user?.id}`)
 );


  if (savedAddress) {
    setAddressList([savedAddress]);
    setSelectedAddress(savedAddress);
    setFormData(savedAddress);
    return;
  }

  const defaultAddress = {
    id: 1,
    full_name: user?.full_name ?? "Người dùng",
    phone: user?.phone ?? "",
    address: "", // để trống nếu user từ chối GPS
    note: user?.note ?? "",
  };

  setAddressList([defaultAddress]);
  setSelectedAddress(defaultAddress);
  setFormData((prev) => ({ ...prev, address: defaultAddress.address }));

  // Hàm fetch địa chỉ từ lat/lon
  const fetchAddress = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      const fullAddress = data.display_name || defaultAddress.address;

      setFormData((prev) => ({ ...prev, address: fullAddress }));
      setSelectedAddress((prev) => ({ ...prev, address: fullAddress }));
    } catch (err) {
      console.log("Reverse geocode error:", err);
    }
  };

  // Lấy GPS nếu trình duyệt hỗ trợ
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchAddress(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        // console.warn("GPS fail, fallback IP:", err.message);
        // fetchAddressByIP();
        console.warn("GPS bị từ chối:", err.message);
        // hiển thị input trực tiếp
        setIsEditing(true);
        setFormData(defaultAddress); // input trống để user nhập
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    console.warn("Geolocation không hỗ trợ");
    setIsEditing(true); // bật nhập thủ công
    setIsAdding(false);
    setFormData(defaultAddress);
    setIsDialogOpen(true);

    // console.warn("Geolocation not supported, fallback IP");
    // fetchAddressByIP();
  }
}, [user]); //cái cũ




// ////////
useEffect(() => {
  if (!user) return;

  // Lấy danh sách địa chỉ đã lưu trước đó
  const savedAddresses = JSON.parse(
    localStorage.getItem(`addressList_${user?.id}`) || "[]"
  );

  if (savedAddresses.length > 0) {
    setAddressList(savedAddresses);
    setSelectedAddress(savedAddresses[0]);
    setFormData(savedAddresses[0]);
  }

  const defaultAddress = {
    id: Date.now(),
    full_name: user?.full_name ?? "Người dùng",
    phone: user?.phone ?? "",
    address: "",
    note: user?.note ?? "",
  };

  // Lấy GPS nếu trình duyệt hỗ trợ
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        fetchAddress(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn("GPS bị từ chối:", err.message);
        setIsEditing(true);
        setFormData(defaultAddress);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  } else {
    console.warn("Geolocation không hỗ trợ");
    setIsEditing(true);
    setFormData(defaultAddress);
  }

  // Hàm fetch địa chỉ từ lat/lon
  const fetchAddress = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await res.json();
      const fullAddress = data.display_name || defaultAddress.address;

      setFormData((prev) => ({ ...prev, address: fullAddress }));
      // Không overwrite selectedAddress cũ trong localStorage
    } catch (err) {
      console.log("Reverse geocode error:", err);
    }
  };
}, [user]);




// Thêm địa chỉ mới
const handleSaveAdd = () => {
  const newAddress = { ...formData, id: Date.now() };
  setAddressList((prev) => {
    const updated = [...prev, newAddress];
    localStorage.setItem(`addressList_${user?.id}`, JSON.stringify(updated));
    return updated;
  });
  setSelectedAddress(newAddress);
  setIsAdding(false);
  alert("✅ Đã thêm địa chỉ mới!");
};

// Lưu khi chỉnh sửa
const handleSaveEdit = () => {
  setAddressList((prev) => {
    const updated = prev.map((addr) =>
      addr.id === selectedAddress.id ? { ...formData, id: addr.id } : addr
    );
    localStorage.setItem(`addressList_${user?.id}`, JSON.stringify(updated));
    return updated;
  });
  setSelectedAddress(formData);
  setIsEditing(false);
  alert("✅ Đã cập nhật địa chỉ!");
};



{addressList.map((addr) => (
  <div
    key={addr.id}
    className={`flex justify-between items-start border rounded-lg p-3 cursor-pointer ${
      selectedAddress?.id === addr.id ? "border-orange-500 bg-orange-50" : "border-gray-200"
    }`}
    onClick={() => handleSelectAddress(addr)}
  >
    <div>
      {addr.isDefault && <p className="text-sm text-orange-500 font-medium mb-1">Mặc định</p>}
      <p className="font-semibold">{addr.full_name}</p>
      <p className="text-sm text-gray-500">{addr.phone}</p>
      <p className="text-sm text-gray-500">{addr.address || "Chưa có địa chỉ"}</p>
      {addr.note && <p className="text-sm text-gray-400 italic">Ghi chú: {addr.note}</p>}
    </div>
    <Button variant="outline" size="sm" onClick={() => handleEditAddress(addr)}>
      <Edit className="w-4 h-4 mr-1" /> Sửa
    </Button>
  </div>
))}












if (!isExisting) {
  // Lưu địa chỉ mới
  const updatedList = [...addressList, newAddress];
  setAddressList(updatedList);
  localStorage.setItem(
    `addressList_${user.id}`,
    JSON.stringify(updatedList)
  );
  // Thêm estimatedTime
  setSelectedAddress({
    ...newAddress,
    estimatedTime,
  });
  alert("✅ Địa chỉ mới đã được lưu vào danh sách địa chỉ cũ!");
} else {
  // Dùng lại địa chỉ cũ
  const existingAddress = addressList.find(
    (addr) =>
      addr.full_name === newAddress.full_name &&
      addr.phone === newAddress.phone &&
      addr.address === newAddress.address
  );
  // Thêm estimatedTime
  setSelectedAddress({
    ...existingAddress,
    estimatedTime,
  });
}








































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
   setCountdown(20);

   // Timer countdown 20s
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
           alert("✅ Địa chỉ mới đã được lưu vào danh sách địa chỉ cũ!");
         } else {
           // Dùng lại địa chỉ cũ nhưng vẫn giữ estimatedTime
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
