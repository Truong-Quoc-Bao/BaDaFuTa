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
  // const auth = useAuth(); // ✅ đúng, trong function component
  const userId = authState?.user?.id ?? authState?.user?._id ?? "guest";

  const hydratedRef = useRef({}); // track per user
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
  const [isInitialized, setIsInitialized] = React.useState(false); // ✅ thêm

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
    // if (hydratedRef.current[userId]) return;
    if (hydratedRef.current[userId]) {
      setIsInitialized(true); // ✅ Nếu đã hydrate thì đánh dấu load xong
      return;
    }
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
        setIsInitialized(true); // ✅ đánh dấu đã load xong

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
    setIsInitialized(true); // ✅ ở cuối luôn
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
        isInitialized, // ✅ export ra context
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
