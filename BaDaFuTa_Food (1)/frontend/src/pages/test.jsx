// // CartContext.jsx (thay thế file hiện tại)
// import React, { createContext, useContext, useReducer, useEffect } from "react";

// const STORAGE_KEY = "app_cart_v1"; // đổi tên nếu cần

// const normalizeRestaurant = (r) => {
//   if (!r) return null;
//   // map common fields, ưu tiên camelCase, fallback snake_case
//   return {
//     id: r.id ?? r.restaurant_id ?? r.merchant_id ?? r.merchant?.id ?? null,
//     name:
//       r.name ?? r.restaurant_name ?? r.merchant_name ?? r.merchant?.name ?? "",
//     // deliveryFee unify:
//     deliveryFee:
//       // try camelCase, then snake_case, then nested merchant
//       r.deliveryFee ??
//       r.delivery_fee ??
//       r.merchant?.deliveryFee ??
//       r.merchant?.delivery_fee ??
//       0,
//     // keep original raw object in case you need other fields
//     raw: r,
//   };
// };

// const normalizeMenuItem = (mi) => {
//   if (!mi) return null;
//   return {
//     ...mi,
//     // ensure price is number
//     price: Number(mi.price) || 0,
//     originalPrice: mi.originalPrice
//       ? Number(mi.originalPrice) || mi.originalPrice
//       : mi.originalPrice,
//     id: mi.id ?? mi.item_id ?? null,
//   };
// };

// const recalcTotal = (items) =>
//   items.reduce((sum, item) => {
//     const toppingsTotal = (item.selectedToppings || []).reduce(
//       (t, top) => t + (Number(top.price) || 0),
//       0
//     );
//     const price = (Number(item.menuItem.price) || 0) + toppingsTotal;
//     return sum + price * (item.quantity || 0);
//   }, 0);

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case "HYDRATE": {
//       return action.payload;
//     }

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

//       // normalize toppings (ensure price number, id present)
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

//       // compare existing by menuItem.id + toppings (sorted ids) + instructions
//       const toppingsKey = (toppingsArr) =>
//         (toppingsArr || [])
//           .map((t) => String(t.id))
//           .sort()
//           .join("|");

//       const existingItem = state.items.find(
//         (it) =>
//           String(it.menuItem.id) === String(menuItem.id) &&
//           toppingsKey(it.selectedToppings) ===
//             toppingsKey(normalizedToppings) &&
//           (it.specialInstructions || "") === specialInstructions &&
//           String(it.restaurant?.id) === String(restaurant?.id)
//       );

//       if (existingItem) {
//         const updatedItems = state.items.map((it) =>
//           it.id === existingItem.id
//             ? { ...it, quantity: (it.quantity || 0) + quantity }
//             : it
//         );
//         return {
//           ...state,
//           items: updatedItems,
//           total: recalcTotal(updatedItems),
//         };
//       }

//       const newItem = {
//         id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
//         menuItem,
//         restaurant,
//         quantity,
//         selectedToppings: normalizedToppings,
//         specialInstructions,
//       };

//       const newItems = [...state.items, newItem];
//       return {
//         ...state,
//         items: newItems,
//         total: recalcTotal(newItems),
//       };
//     }

//     case "REMOVE_ITEM": {
//       const id = action.payload;
//       const newItems = state.items.filter((it) => it.id !== id);
//       return {
//         ...state,
//         items: newItems,
//         total: recalcTotal(newItems),
//       };
//     }

//     case "UPDATE_QUANTITY": {
//       const { id, quantity } = action.payload;
//       if (quantity <= 0) {
//         const newItems = state.items.filter((it) => it.id !== id);
//         return {
//           ...state,
//           items: newItems,
//           total: recalcTotal(newItems),
//         };
//       }
//       const updatedItems = state.items.map((it) =>
//         it.id === id ? { ...it, quantity } : it
//       );
//       return {
//         ...state,
//         items: updatedItems,
//         total: recalcTotal(updatedItems),
//       };
//     }

//     case "CLEAR_CART": {
//       return { items: [], total: 0 };
//     }

//     default:
//       return state;
//   }
// };

// const CartContext = createContext(undefined);

// export const useCart = () => {
//   const ctx = useContext(CartContext);
//   if (!ctx) throw new Error("useCart must be used within CartProvider");
//   return ctx;
// };

// const getInitialState = () => {
//   try {
//     const raw = sessionStorage.getItem(STORAGE_KEY);
//     if (!raw) return { items: [], total: 0 };
//     const parsed = JSON.parse(raw);
//     // basic validation
//     return parsed && Array.isArray(parsed.items)
//       ? parsed
//       : { items: [], total: 0 };
//   } catch (e) {
//     console.warn("Failed to parse cart from sessionStorage:", e);
//     return { items: [], total: 0 };
//   }
// };

// export const CartProvider = ({ children }) => {
//   const [state, dispatch] = React.useReducer(cartReducer, undefined, () =>
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

//   // helpers
//   // const addItem = (menuItem, restaurant) => {
//   //   dispatch({ type: "ADD_ITEM", payload: { menuItem, restaurant } });
//   // };

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

//   const removeItem = (id) => {
//     dispatch({ type: "REMOVE_ITEM", payload: id });
//   };

//   const updateQuantity = (id, quantity) => {
//     dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
//   };

//   const clearCart = () => {
//     dispatch({ type: "CLEAR_CART" });
//   };

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






//   const handleAddToCart = () => {
//     if (!item || !restaurant) return;

//     if (!isAvailable) {
//       toast.error(`${qty} phần ${item.name} đã hết hàng, thử món khác nhé!`);
//       return;
//     }

//     if (item.toppings?.length && !toppingSelected) {
//       setShowToppingDialog(true);
//     } else {
//       addItem(item, restaurant, qty);

//       // chỉ chạy animation khi cả 2 ref có giá trị
//       if (imgRef.current && cartIconRef.current) {
//         flyToCart(); // chạy animation
//       }

//       // hiện toast sau animation (hoặc cùng lúc, tuỳ ý)

//       toast.custom((t) => (
//         <div
//           className={`${
//             t.visible ? "animate-enter" : "animate-leave"
//           } flex items-center gap-2 bg-white border border-gray-200 w-[50vw] sm:w-[380px] p-3 rounded-lg`}
//         >
//           <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-green-500 rounded-full text-white font-bold">
//             ✓
//           </div>
//           <img
//             src={item.image}
//             alt={item.name}
//             className="w-7 h-7 sm:w-8 sm:h-8 object-cover rounded"
//           />
//           <span className="text-xs sm:text-sm font-medium leading-snug break-words">
//             Đã thêm <span className="font-bold text-black">{qty} </span> cái{" "}
//             <span className="font-bold text-black">{item.name}</span> vào giỏ
//             hàng!
//           </span>
//         </div>
//       ));

//     }
//   // };

import React from "react";
import { cn } from "./utils";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-[16px] lowercase md:text-sm", // font cứng 16px → iOS không zoom + chữ thường
        "placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border flex h-9 w-full min-w-0 px-3 py-1 bg-input-background transition-[color,box-shadow] outline-none",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive rounded-lg bg-gray-100",
        className
      )}
      style={{
        WebkitTextSizeAdjust: "100%", // tắt auto-scale trên iOS
      }}
      {...props}
    />
  );
}

export { Input };
