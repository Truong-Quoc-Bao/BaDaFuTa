// // // CartContext.jsx (thay thế file hiện tại)
// // import React, { createContext, useContext, useReducer, useEffect } from "react";

// // const STORAGE_KEY = "app_cart_v1"; // đổi tên nếu cần

// // const normalizeRestaurant = (r) => {
// //   if (!r) return null;
// //   // map common fields, ưu tiên camelCase, fallback snake_case
// //   return {
// //     id: r.id ?? r.restaurant_id ?? r.merchant_id ?? r.merchant?.id ?? null,
// //     name:
// //       r.name ?? r.restaurant_name ?? r.merchant_name ?? r.merchant?.name ?? "",
// //     // deliveryFee unify:
// //     deliveryFee:
// //       // try camelCase, then snake_case, then nested merchant
// //       r.deliveryFee ??
// //       r.delivery_fee ??
// //       r.merchant?.deliveryFee ??
// //       r.merchant?.delivery_fee ??
// //       0,
// //     // keep original raw object in case you need other fields
// //     raw: r,
// //   };
// // };



// // const normalizeMenuItem = (mi) => {
// //   if (!mi) return null;
// //   return {
// //     ...mi,
// //     // ensure price is number
// //     price: Number(mi.price) || 0,
// //     originalPrice: mi.originalPrice
// //       ? Number(mi.originalPrice) || mi.originalPrice
// //       : mi.originalPrice,
// //     id: mi.id ?? mi.item_id ?? null,
// //   };
// // };

// // const recalcTotal = (items) =>
// //   items.reduce((sum, item) => {
// //     const toppingsTotal = (item.selectedToppings || []).reduce(
// //       (t, top) => t + (Number(top.price) || 0),
// //       0
// //     );
// //     const price = (Number(item.menuItem.price) || 0) + toppingsTotal;
// //     return sum + price * (item.quantity || 0);
// //   }, 0);

// // const cartReducer = (state, action) => {
// //   switch (action.type) {
// //     case "HYDRATE": {
// //       return action.payload;
// //     }

// //     case "ADD_ITEM": {
// //       const {
// //         menuItem: rawMenuItem,
// //         restaurant: rawRestaurant,
// //         selectedToppings = [],
// //         specialInstructions = "",
// //         quantity = 1,
// //       } = action.payload;

// //       const menuItem = normalizeMenuItem(rawMenuItem);
// //       const restaurant = normalizeRestaurant(rawRestaurant);

// //       // normalize toppings (ensure price number, id present)
// //       const normalizedToppings = (selectedToppings || []).map((t) => ({
// //         id: t.id ?? t.topping_id ?? JSON.stringify(t),
// //         name: t.name ?? t.label ?? "",
// //         price: Number(t.price) || 0,
// //         raw: t,
// //       }));

// //       // ✨ Nếu giỏ hiện có món từ nhà hàng khác → clear cart
// //       if (
// //         state.items.length > 0 &&
// //         state.items[0].restaurant?.id !== restaurant.id
// //       ) {
// //         toast.info("Thêm món mới từ nhà hàng khác → xóa món cũ");
// //         const newItem = {
// //           id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
// //           menuItem,
// //           restaurant,
// //           quantity,
// //           selectedToppings: normalizedToppings,
// //           specialInstructions,
// //         };
// //         return {
// //           ...state,
// //           items: [newItem],
// //           total: recalcTotal([newItem]),
// //         };
// //       }

// //       // compare existing by menuItem.id + toppings (sorted ids) + instructions
// //       const toppingsKey = (toppingsArr) =>
// //         (toppingsArr || [])
// //           .map((t) => String(t.id))
// //           .sort()
// //           .join("|");

// //       const existingItem = state.items.find(
// //         (it) =>
// //           String(it.menuItem.id) === String(menuItem.id) &&
// //           toppingsKey(it.selectedToppings) ===
// //             toppingsKey(normalizedToppings) &&
// //           (it.specialInstructions || "") === specialInstructions &&
// //           String(it.restaurant?.id) === String(restaurant?.id)
// //       );

// //       if (existingItem) {
// //         const updatedItems = state.items.map((it) =>
// //           it.id === existingItem.id
// //             ? { ...it, quantity: (it.quantity || 0) + quantity }
// //             : it
// //         );
// //         return {
// //           ...state,
// //           items: updatedItems,
// //           total: recalcTotal(updatedItems),
// //         };
// //       }

// //       const newItem = {
// //         id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
// //         menuItem,
// //         restaurant,
// //         quantity,
// //         selectedToppings: normalizedToppings,
// //         specialInstructions,
// //       };

// //       const newItems = [...state.items, newItem];
// //       return {
// //         ...state,
// //         items: newItems,
// //         total: recalcTotal(newItems),
// //       };
// //     }

// //     case "REMOVE_ITEM": {
// //       const id = action.payload;
// //       const newItems = state.items.filter((it) => it.id !== id);
// //       return {
// //         ...state,
// //         items: newItems,
// //         total: recalcTotal(newItems),
// //       };
// //     }

// //     case "UPDATE_QUANTITY": {
// //       const { id, quantity } = action.payload;
// //       if (quantity <= 0) {
// //         const newItems = state.items.filter((it) => it.id !== id);
// //         return {
// //           ...state,
// //           items: newItems,
// //           total: recalcTotal(newItems),
// //         };
// //       }
// //       const updatedItems = state.items.map((it) =>
// //         it.id === id ? { ...it, quantity } : it
// //       );
// //       return {
// //         ...state,
// //         items: updatedItems,
// //         total: recalcTotal(updatedItems),
// //       };
// //     }

// //     case "CLEAR_CART": {
// //       return { items: [], total: 0 };
// //     }

// //     default:
// //       return state;
// //   }
// // };

// // const CartContext = createContext(undefined);

// // export const useCart = () => {
// //   const ctx = useContext(CartContext);
// //   if (!ctx) throw new Error("useCart must be used within CartProvider");
// //   return ctx;
// // };

// // const getInitialState = () => {
// //   try {
// //     const raw = sessionStorage.getItem(STORAGE_KEY);
// //     if (!raw) return { items: [], total: 0 };
// //     const parsed = JSON.parse(raw);
// //     // basic validation
// //     return parsed && Array.isArray(parsed.items)
// //       ? parsed
// //       : { items: [], total: 0 };
// //   } catch (e) {
// //     console.warn("Failed to parse cart from sessionStorage:", e);
// //     return { items: [], total: 0 };
// //   }
// // };

// // export const CartProvider = ({ children }) => {
// //   const [state, dispatch] = React.useReducer(cartReducer, undefined, () =>
// //     getInitialState()
// //   );

// //   // persist to sessionStorage on changes
// //   useEffect(() => {
// //     try {
// //       sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
// //     } catch (e) {
// //       console.warn("Failed to save cart to sessionStorage:", e);
// //     }
// //   }, [state]);

// //   // helpers
// //   // const addItem = (menuItem, restaurant) => {
// //   //   dispatch({ type: "ADD_ITEM", payload: { menuItem, restaurant } });
// //   // };

// //   const addItem = (menuItem, restaurant, quantity = 1) => {
// //     dispatch({ type: "ADD_ITEM", payload: { menuItem, restaurant, quantity } });
// //   };

// //   const addItemWithToppings = (
// //     menuItem,
// //     restaurant,
// //     selectedToppings = [],
// //     specialInstructions = "",
// //     quantity = 1
// //   ) => {
// //     dispatch({
// //       type: "ADD_ITEM",
// //       payload: {
// //         menuItem,
// //         restaurant,
// //         selectedToppings,
// //         specialInstructions,
// //         quantity,
// //       },
// //     });
// //   };

// //   const removeItem = (id) => {
// //     dispatch({ type: "REMOVE_ITEM", payload: id });
// //   };

// //   const updateQuantity = (id, quantity) => {
// //     dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
// //   };

// //   const clearCart = () => {
// //     dispatch({ type: "CLEAR_CART" });
// //   };

// //   return (
// //     <CartContext.Provider
// //       value={{
// //         state,
// //         dispatch,
// //         addItem,
// //         addItemWithToppings,
// //         removeItem,
// //         updateQuantity,
// //         clearCart,
// //       }}
// //     >
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };






// //   const handleAddToCart = () => {
// //     if (!item || !restaurant) return;

// //     if (!isAvailable) {
// //       toast.error(`${qty} phần ${item.name} đã hết hàng, thử món khác nhé!`);
// //       return;
// //     }

// //     if (item.toppings?.length && !toppingSelected) {
// //       setShowToppingDialog(true);
// //     } else {
// //       addItem(item, restaurant, qty);

// //       // chỉ chạy animation khi cả 2 ref có giá trị
// //       if (imgRef.current && cartIconRef.current) {
// //         flyToCart(); // chạy animation
// //       }

// //       // hiện toast sau animation (hoặc cùng lúc, tuỳ ý)

// //       toast.custom((t) => (
// //         <div
// //           className={`${
// //             t.visible ? "animate-enter" : "animate-leave"
// //           } flex items-center gap-2 bg-white border border-gray-200 w-[50vw] sm:w-[380px] p-3 rounded-lg`}
// //         >
// //           <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-green-500 rounded-full text-white font-bold">
// //             ✓
// //           </div>
// //           <img
// //             src={item.image}
// //             alt={item.name}
// //             className="w-7 h-7 sm:w-8 sm:h-8 object-cover rounded"
// //           />
// //           <span className="text-xs sm:text-sm font-medium leading-snug break-words">
// //             Đã thêm <span className="font-bold text-black">{qty} </span> cái{" "}
// //             <span className="font-bold text-black">{item.name}</span> vào giỏ
// //             hàng!
// //           </span>
// //         </div>
// //       ));

// //     }
// //   // };

// import React from "react";
// import { cn } from "./utils";

// function Input({ className, type = "text", ...props }) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "text-[16px] lowercase md:text-sm", // font cứng 16px → iOS không zoom + chữ thường
//         "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border flex h-9 w-full min-w-0 px-3 py-1 bg-input-background transition-[color,box-shadow] outline-none",
//         "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
//         "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
//         "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200",
//         "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-lg bg-gray-100",
//         className
//       )}
//       style={{
//         WebkitTextSizeAdjust: "100%", // tắt auto-scale trên iOS
//       }}
//       {...props}
//     />
//   );
// }

// export { Input };





// CartContext.jsx
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
} from "react";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

const STORAGE_KEY = "app_cart_v1"; // base key

// ======= Helpers =======
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

// merge two carts: base <- added (added items get added into base, quantities summed when identical)
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
      const itemToPush = {
        ...newIt,
        id:
          newIt.id ??
          Date.now().toString() + Math.random().toString(36).slice(2, 9),
      };
      items.push(itemToPush);
    }
  }

  return { items, total: recalcTotal(items) };
};

// ======= Reducer & initial =======
const initialCart = { items: [], total: 0 };

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

      // If different restaurant: clear cart then add
      if (items.length > 0 && items[0].restaurant?.id !== restaurant.id) {
        toast.info("Thêm món mới từ nhà hàng khác → xóa món cũ");
        const newItem = {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
          menuItem,
          restaurant,
          quantity,
          selectedToppings: normalizedToppings,
          specialInstructions,
        };
        return { items: [newItem], total: recalcTotal([newItem]) };
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
        toast.success(`Cập nhật số lượng món "${menuItem.name}"`);
        return { items: updatedItems, total: recalcTotal(updatedItems) };
      }

      const newItem = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
        menuItem,
        restaurant,
        quantity,
        selectedToppings: normalizedToppings,
        specialInstructions,
      };

      toast.success(`Thêm món "${menuItem.name}" vào giỏ`);
      const nextItems = [...items, newItem];
      return { items: nextItems, total: recalcTotal(nextItems) };
    }

    case "REMOVE_ITEM": {
      const id = action.payload;
      const newItems = (safeState.items || []).filter((it) => it.id !== id);
      return { items: newItems, total: recalcTotal(newItems) };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = (safeState.items || []).filter((it) => it.id !== id);
        return { items: newItems, total: recalcTotal(newItems) };
      }
      const updatedItems = (safeState.items || []).map((it) =>
        it.id === id ? { ...it, quantity } : it
      );
      return { items: updatedItems, total: recalcTotal(updatedItems) };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return safeState;
  }
};

// ======= Context =======
const CartContext = createContext(undefined);
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

// ======= Storage helpers =======
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

// ======= Provider =======
export const CartProvider = ({ children }) => {
  const { state: authState } = useAuth(); // expects { user, isAuthenticated, isLoading }
  const userId = authState?.user?.id ?? authState?.user?._id ?? "guest";

  const hydratedRef = useRef(false);
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  // 1) Hydrate when auth has finished initial load (avoid race on page reload)
  // useEffect(() => {
  //   if (authState?.isLoading) return; // wait for auth to finish initial load

  //   const savedForUser = getInitialState(userId);

  //   // if logging in (userId !== 'guest') and guest cart exists => merge guest -> user
  //   if (userId !== "guest") {
  //     const guestCart = getInitialState("guest");
  //     if (guestCart.items && guestCart.items.length > 0) {
  //       const merged = mergeCarts(savedForUser, guestCart);
  //       try {
  //         localStorage.setItem(
  //           `${STORAGE_KEY}_${userId}`,
  //           JSON.stringify(merged)
  //         );
  //         // optional: remove guest cart if you want to consume it:
  //         // localStorage.removeItem(`${STORAGE_KEY}_guest`);
  //       } catch (e) {
  //         console.warn("Failed to write merged cart:", e);
  //       }
  //       dispatch({ type: "HYDRATE", payload: merged });
  //       hydratedRef.current = true;
  //       return;
  //     }
  //   }

  //   // otherwise hydrate saved (guest or user)
  //   dispatch({ type: "HYDRATE", payload: savedForUser });
  //   hydratedRef.current = true;
  // }, [authState?.isLoading, userId]);



  useEffect(() => {
    if (authState?.isLoading) return;
    if (hydratedRef.current) return; // 👈 chặn hydrate lần 2

    const savedForUser = getInitialState(userId);

    if (userId !== "guest") {
      const guestCart = getInitialState("guest");
      if (guestCart.items && guestCart.items.length > 0) {
        const merged = mergeCarts(savedForUser, guestCart);
        try {
          localStorage.setItem(
            `${STORAGE_KEY}_${userId}`,
            JSON.stringify(merged)
          );
        } catch (e) {
          console.warn("Failed to write merged cart:", e);
        }
        dispatch({ type: "HYDRATE", payload: merged });
        hydratedRef.current = true;
        return;
      }
    }

    dispatch({ type: "HYDRATE", payload: savedForUser });
    hydratedRef.current = true;
  }, [authState?.isLoading, userId]);

  // 2) Persist to localStorage when state changes (avoid writes until hydrated)
  useEffect(() => {
    try {
      if (!hydratedRef.current) return;
      const key = `${STORAGE_KEY}_${userId}`;
      const raw = localStorage.getItem(key);
      const existing = raw ? JSON.parse(raw) : null;

      const needWrite =
        !existing ||
        JSON.stringify(existing.items) !== JSON.stringify(state.items) ||
        existing.total !== state.total;

      if (needWrite) {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (e) {
      console.warn("Failed to save cart:", e);
    }
  }, [state, userId]);

  // 3) Listen logout event to clear UI immediately (we DO NOT delete saved user cart)
  useEffect(() => {
    const handleLogout = () => {
      dispatch({ type: "CLEAR_CART" });
      // keep hydratedRef true so next login will hydrate properly
      hydratedRef.current = false;
    };
    window.addEventListener("user-logged-out", handleLogout);
    return () => window.removeEventListener("user-logged-out", handleLogout);
  }, []);

  // ======= Actions =======
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



//cart cũ



// // CartContext.jsx
// import React, { createContext, useContext, useReducer, useEffect } from "react";
// import { toast } from "sonner";

// const STORAGE_KEY = "app_cart_v1"; // đổi tên nếu cần

// // ======= Normalize Helpers =======
// const normalizeRestaurant = (r) => {
//   if (!r) return null;
//   return {
//     id: r.id ?? r.restaurant_id ?? r.merchant_id ?? r.merchant?.id ?? null,
//     name:
//       r.name ?? r.restaurant_name ?? r.merchant_name ?? r.merchant?.name ?? "",
//     deliveryFee:
//       r.deliveryFee ??
//       r.delivery_fee ??
//       r.merchant?.deliveryFee ??
//       r.merchant?.delivery_fee ??
//       0,
//     raw: r,
//   };
// };

// const normalizeMenuItem = (mi) => {
//   if (!mi) return null;
//   return {
//     ...mi,
//     price: Number(mi.price) || 0,
//     originalPrice: mi.originalPrice
//       ? Number(mi.originalPrice) || mi.originalPrice
//       : mi.originalPrice,
//     id: mi.id ?? mi.item_id ?? null,
//   };
// };

// // ======= Recalculate Total =======
// const recalcTotal = (items) =>
//   items.reduce((sum, item) => {
//     const toppingsTotal = (item.selectedToppings || []).reduce(
//       (t, top) => t + (Number(top.price) || 0),
//       0
//     );
//     const price = (Number(item.menuItem.price) || 0) + toppingsTotal;
//     return sum + price * (item.quantity || 0);
//   }, 0);

// // ======= Reducer =======
// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case "HYDRATE":
//       return action.payload;

//     case "ADD_ITEM": {
//       const {
//         menuItem: rawMenuItem,
//         restaurant: rawRestaurant,
//         selectedToppings = [],
//         specialInstructions = "",
//         quantity = 1,
//       } = action.payload;

//       const menuItem = normalizeMenuItem(rawMenuItem);
//       const restaurant = normalizeRestaurant(rawRestaurant);

//       const normalizedToppings = (selectedToppings || []).map((t) => ({
//         id: t.id ?? t.topping_id ?? JSON.stringify(t),
//         name: t.name ?? t.label ?? "",
//         price: Number(t.price) || 0,
//         raw: t,
//       }));

//       // ✨ Nếu giỏ hiện có món từ nhà hàng khác → clear cart
//       if (
//         state.items.length > 0 &&
//         state.items[0].restaurant?.id !== restaurant.id
//       ) {
//         toast.info("Thêm món mới từ nhà hàng khác → xóa món cũ");
//         const newItem = {
//           id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
//           menuItem,
//           restaurant,
//           quantity,
//           selectedToppings: normalizedToppings,
//           specialInstructions,
//         };
//         return {
//           ...state,
//           items: [newItem],
//           total: recalcTotal([newItem]),
//         };
//       }

//       // Hàm tạo key để so sánh topping
//       const toppingsKey = (toppingsArr) =>
//         (toppingsArr || []).map((t) => String(t.id)).sort().join("|");

//       const existingItem = state.items.find(
//         (it) =>
//           String(it.menuItem.id) === String(menuItem.id) &&
//           toppingsKey(it.selectedToppings) === toppingsKey(normalizedToppings) &&
//           (it.specialInstructions || "") === specialInstructions &&
//           String(it.restaurant?.id) === String(restaurant?.id)
//       );

//       if (existingItem) {
//         const updatedItems = state.items.map((it) =>
//           it.id === existingItem.id
//             ? { ...it, quantity: (it.quantity || 0) + quantity }
//             : it
//         );
//         toast.success(`Cập nhật số lượng món "${menuItem.name}"`);
//         return { ...state, items: updatedItems, total: recalcTotal(updatedItems) };
//       }

//       const newItem = {
//         id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
//         menuItem,
//         restaurant,
//         quantity,
//         selectedToppings: normalizedToppings,
//         specialInstructions,
//       };

//       toast.success(`Thêm món "${menuItem.name}" vào giỏ`);
//       return {
//         ...state,
//         items: [...state.items, newItem],
//         total: recalcTotal([...state.items, newItem]),
//       };
//     }

//     case "REMOVE_ITEM": {
//       const id = action.payload;
//       const newItems = state.items.filter((it) => it.id !== id);
//       return { ...state, items: newItems, total: recalcTotal(newItems) };
//     }

//     case "UPDATE_QUANTITY": {
//       const { id, quantity } = action.payload;
//       if (quantity <= 0) {
//         const newItems = state.items.filter((it) => it.id !== id);
//         return { ...state, items: newItems, total: recalcTotal(newItems) };
//       }
//       const updatedItems = state.items.map((it) =>
//         it.id === id ? { ...it, quantity } : it
//       );
//       return { ...state, items: updatedItems, total: recalcTotal(updatedItems) };
//     }

//     case "CLEAR_CART":
//       return { items: [], total: 0 };

//     default:
//       return state;
//   }
// };

// // ======= Context =======
// const CartContext = createContext(undefined);

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used within CartProvider");
//   return ctx;
// };

// // ======= Initial State =======
// const getInitialState = () => {
//   try {
//     const raw = sessionStorage.getItem(STORAGE_KEY);
//     if (!raw) return { items: [], total: 0 };
//     const parsed = JSON.parse(raw);
//     return parsed && Array.isArray(parsed.items) ? parsed : { items: [], total: 0 };
//   } catch (e) {
//     console.warn("Failed to parse cart from sessionStorage:", e);
//     return { items: [], total: 0 };
//   }
// };

// // ======= Provider =======
// export const CartProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, undefined, () =>
//     getInitialState()
//   );

//   // persist to sessionStorage on changes
//   useEffect(() => {
//     try {
//       sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
//     } catch (e) {
//       console.warn("Failed to save cart to sessionStorage:", e);
//     }
//   }, [state]);

//   // ======= Helpers =======
//   const addItem = (menuItem, restaurant, quantity = 1) => {
//     dispatch({ type: "ADD_ITEM", payload: { menuItem, restaurant, quantity } });
//   };

//   const addItemWithToppings = (
//     menuItem,
//     restaurant,
//     selectedToppings = [],
//     specialInstructions = "",
//     quantity = 1
//   ) => {
//     dispatch({
//       type: "ADD_ITEM",
//       payload: {
//         menuItem,
//         restaurant,
//         selectedToppings,
//         specialInstructions,
//         quantity,
//       },
//     });
//   };

//   const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
//   const updateQuantity = (id, quantity) =>
//     dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
//   const clearCart = () => dispatch({ type: "CLEAR_CART" });

//   return (
//     <CartContext.Provider
//       value={{
//         state,
//         dispatch,
//         addItem,
//         addItemWithToppings,
//         removeItem,
//         updateQuantity,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };











import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  Phone,
  ArrowLeft,
  Check,
  XCircle,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { cn } from "../components/ui/utils";
import { Logo } from "../components/Logo";

export default function PhoneVerification() {
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0); // 🕒 thời gian đếm ngược
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (value) => {
    setPhone(value);
    const phoneRegex = /^0\d{9}$/;

    if (!value) setPhoneError("");
    else if (!value.startsWith("0"))
      setPhoneError("Số điện thoại phải bắt đầu bằng 0");
    else if (value.length > 10)
      setPhoneError("Số điện thoại không được quá 10 số");
    else if (!phoneRegex.test(value))
      setPhoneError("Số điện thoại phải có đúng 10 chữ số");
    else setPhoneError("");
  };

  const startCountdown = () => {
    setCountdown(60); // 60 giây
  };

  // 🔁 đếm ngược
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const normalizedPhone = phone.trim();

    if (phoneError || normalizedPhone.length !== 10) {
      return alert("Vui lòng nhập số điện thoại hợp lệ!");
    }

    setLoading(true);
    try {
      const res = await fetch("http://192.168.100.124:3000/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalizedPhone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        startCountdown(); // bắt đầu đếm ngược
        alert(data.message);
      } else {
        alert(data.message || "Không thể gửi OTP!");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi mạng!");
    } finally {
      setLoading(false);
    }
  };

  const [otpError, setOtpError] = useState(""); // 🔴 lỗi OTP

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setOtpError("Vui lòng nhập mã OTP!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://192.168.100.124:3000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpError("");
        setOtpMessage("");
        setSuccessMessage("Xác minh thành công!");
        // điều hướng sau 1s để người dùng nhìn thấy message
        setTimeout(() => navigate("/register", { state: { phone } }), 1000);
      } else {
        setOtpError(data.message || "OTP không đúng!");
      }
    } catch (err) {
      console.error(err);
      setOtpError("Lỗi mạng!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/login")}
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại đăng nhập
        </Button>

        <Card className="hover:scale-100">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-600 rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                <Logo size="lg" className="text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              Xác minh số điện thoại
            </CardTitle>
            <CardDescription className="text-center">
              Vui lòng xác nhận số điện thoại để tiếp tục đăng ký tài khoản
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Nhập số điện thoại (VD: 0987...)"
                  value={phone}
                  onChange={(e) => handleChange(e.target.value)}
                  disabled={otpSent}
                  className={cn(
                    "pl-10 pr-10",
                    phoneError
                      ? "border-red-500 hover:border-red-500 focus:border-red-500"
                      : phone.length === 10
                      ? "border-green-500 hover:border-green-500 focus:border-green-500"
                      : "border-gray-300"
                  )}
                />
                {phoneError && (
                  <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                )}
                {!phoneError && phone.length === 10 && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500 w-4 h-4" />
                )}
              </div>
              {phoneError && (
                <p className="text-xs text-red-500 text-left">{phoneError}</p>
              )}
            </div>

            {otpSent && (
              <div className="space-y-2">
                <Label htmlFor="otp">Mã OTP</Label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Nhập mã OTP"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      setOtpError(""); // xóa lỗi khi người dùng gõ lại
                    }}
                    className={cn(
                      "pl-10 pr-10",
                      otpError
                        ? "border-red-500 hover:border-red-500 focus:border-red-500"
                        : otp.length > 0
                        ? "border-green-500 hover:border-green-500 focus:border-green-500"
                        : "border-gray-300"
                    )}
                  />
                  {otpError && (
                    <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500 w-4 h-4" />
                  )}
                </div>
                {successMessage && (
                  <p className="text-xs text-green-500 mt-1">
                    {successMessage}
                  </p>
                )}

                {otpError && (
                  <p className="text-xs text-red-500 mt-1">{otpError}</p>
                )}
                {/* ⏱️ Hiển thị đếm ngược */}
                {countdown > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Bạn có thể gửi lại OTP sau {countdown}s
                  </p>
                )}
              </div>
            )}

            {!otpSent ? (
              <Button
                onClick={handleSendOtp}
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Đang gửi
                    OTP...
                  </>
                ) : (
                  "Gửi OTP"
                )}
              </Button>
            ) : (
              <Button
                onClick={countdown === 0 ? handleSendOtp : handleVerifyOtp}
                className={`w-full ${
                  countdown === 0
                    ? "bg-orange-500 hover:bg-orange-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {countdown === 0 ? "Đang gửi OTP..." : "Đang xác minh..."}
                  </>
                ) : countdown === 0 ? (
                  "Gửi lại OTP"
                ) : (
                  "Xác minh OTP"
                )}
              </Button>
            )}
          </CardContent>

          <CardFooter className="text-center text-sm text-gray-600">
            <Separator />
            <div className="pt-4">
              Đã có tài khoản?{" "}
              <Button
                variant="link"
                className="text-orange-600 hover:text-orange-700 font-medium p-0"
                onClick={() => navigate("/login")}
              >
                Đăng nhập ngay
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
