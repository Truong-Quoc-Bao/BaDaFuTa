

// CartContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { toast } from "sonner";

const STORAGE_KEY = "app_cart_v1"; // đổi tên nếu cần

// ======= Normalize Helpers =======
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

// ======= Recalculate Total =======
const recalcTotal = (items) =>
  items.reduce((sum, item) => {
    const toppingsTotal = (item.selectedToppings || []).reduce(
      (t, top) => t + (Number(top.price) || 0),
      0
    );
    const price = (Number(item.menuItem.price) || 0) + toppingsTotal;
    return sum + price * (item.quantity || 0);
  }, 0);

// ======= Reducer =======
const cartReducer = (state, action) => {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

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

      // ✨ Nếu giỏ hiện có món từ nhà hàng khác → clear cart
      if (
        state.items.length > 0 &&
        state.items[0].restaurant?.id !== restaurant.id
      ) {
        toast.info("Thêm món mới từ nhà hàng khác → xóa món cũ");
        const newItem = {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
          menuItem,
          restaurant,
          quantity,
          selectedToppings: normalizedToppings,
          specialInstructions,
        };
        return {
          ...state,
          items: [newItem],
          total: recalcTotal([newItem]),
        };
      }

      // Hàm tạo key để so sánh topping
      const toppingsKey = (toppingsArr) =>
        (toppingsArr || []).map((t) => String(t.id)).sort().join("|");

      const existingItem = state.items.find(
        (it) =>
          String(it.menuItem.id) === String(menuItem.id) &&
          toppingsKey(it.selectedToppings) === toppingsKey(normalizedToppings) &&
          (it.specialInstructions || "") === specialInstructions &&
          String(it.restaurant?.id) === String(restaurant?.id)
      );

      if (existingItem) {
        const updatedItems = state.items.map((it) =>
          it.id === existingItem.id
            ? { ...it, quantity: (it.quantity || 0) + quantity }
            : it
        );
        toast.success(`Cập nhật số lượng món "${menuItem.name}"`);
        return { ...state, items: updatedItems, total: recalcTotal(updatedItems) };
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
      return {
        ...state,
        items: [...state.items, newItem],
        total: recalcTotal([...state.items, newItem]),
      };
    }

    case "REMOVE_ITEM": {
      const id = action.payload;
      const newItems = state.items.filter((it) => it.id !== id);
      return { ...state, items: newItems, total: recalcTotal(newItems) };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter((it) => it.id !== id);
        return { ...state, items: newItems, total: recalcTotal(newItems) };
      }
      const updatedItems = state.items.map((it) =>
        it.id === id ? { ...it, quantity } : it
      );
      return { ...state, items: updatedItems, total: recalcTotal(updatedItems) };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
};

// ======= Context =======
const CartContext = createContext(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

// ======= Initial State =======
const getInitialState = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], total: 0 };
    const parsed = JSON.parse(raw);
    return parsed && Array.isArray(parsed.items) ? parsed : { items: [], total: 0 };
  } catch (e) {
    console.warn("Failed to parse cart from sessionStorage:", e);
    return { items: [], total: 0 };
  }
};

// ======= Provider =======
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, undefined, () =>
    getInitialState()
  );

  // persist to sessionStorage on changes
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save cart to sessionStorage:", e);
    }
  }, [state]);

  // ======= Helpers =======
  const addItem = (menuItem, restaurant, quantity = 1) => {
    dispatch({ type: "ADD_ITEM", payload: { menuItem, restaurant, quantity } });
  };

  const addItemWithToppings = (
    menuItem,
    restaurant,
    selectedToppings = [],
    specialInstructions = "",
    quantity = 1
  ) => {
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
  };

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
