// CartContext.jsx (thay thế file hiện tại)
import React, { createContext, useContext, useReducer, useEffect } from "react";

const STORAGE_KEY = "app_cart_v1"; // đổi tên nếu cần

const normalizeRestaurant = (r) => {
  if (!r) return null;
  // map common fields, ưu tiên camelCase, fallback snake_case
  return {
    id: r.id ?? r.restaurant_id ?? r.merchant_id ?? r.merchant?.id ?? null,
    name:
      r.name ?? r.restaurant_name ?? r.merchant_name ?? r.merchant?.name ?? "",
    // deliveryFee unify:
    deliveryFee:
      // try camelCase, then snake_case, then nested merchant
      r.deliveryFee ??
      r.delivery_fee ??
      r.merchant?.deliveryFee ??
      r.merchant?.delivery_fee ??
      0,
    // keep original raw object in case you need other fields
    raw: r,
  };
};

const normalizeMenuItem = (mi) => {
  if (!mi) return null;
  return {
    ...mi,
    // ensure price is number
    price: Number(mi.price) || 0,
    originalPrice: mi.originalPrice
      ? Number(mi.originalPrice) || mi.originalPrice
      : mi.originalPrice,
    id: mi.id ?? mi.item_id ?? null,
  };
};

const recalcTotal = (items) =>
  items.reduce((sum, item) => {
    const toppingsTotal = (item.selectedToppings || []).reduce(
      (t, top) => t + (Number(top.price) || 0),
      0
    );
    const price = (Number(item.menuItem.price) || 0) + toppingsTotal;
    return sum + price * (item.quantity || 0);
  }, 0);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "HYDRATE": {
      return action.payload;
    }

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

      // normalize toppings (ensure price number, id present)
      const normalizedToppings = (selectedToppings || []).map((t) => ({
        id: t.id ?? t.topping_id ?? JSON.stringify(t),
        name: t.name ?? t.label ?? "",
        price: Number(t.price) || 0,
        raw: t,
      }));

      // compare existing by menuItem.id + toppings (sorted ids) + instructions
      const toppingsKey = (toppingsArr) =>
        (toppingsArr || [])
          .map((t) => String(t.id))
          .sort()
          .join("|");

      const existingItem = state.items.find(
        (it) =>
          String(it.menuItem.id) === String(menuItem.id) &&
          toppingsKey(it.selectedToppings) ===
            toppingsKey(normalizedToppings) &&
          (it.specialInstructions || "") === specialInstructions &&
          String(it.restaurant?.id) === String(restaurant?.id)
      );

      if (existingItem) {
        const updatedItems = state.items.map((it) =>
          it.id === existingItem.id
            ? { ...it, quantity: (it.quantity || 0) + quantity }
            : it
        );
        return {
          ...state,
          items: updatedItems,
          total: recalcTotal(updatedItems),
        };
      }

      const newItem = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 9),
        menuItem,
        restaurant,
        quantity,
        selectedToppings: normalizedToppings,
        specialInstructions,
      };

      const newItems = [...state.items, newItem];
      return {
        ...state,
        items: newItems,
        total: recalcTotal(newItems),
      };
    }

    case "REMOVE_ITEM": {
      const id = action.payload;
      const newItems = state.items.filter((it) => it.id !== id);
      return {
        ...state,
        items: newItems,
        total: recalcTotal(newItems),
      };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter((it) => it.id !== id);
        return {
          ...state,
          items: newItems,
          total: recalcTotal(newItems),
        };
      }
      const updatedItems = state.items.map((it) =>
        it.id === id ? { ...it, quantity } : it
      );
      return {
        ...state,
        items: updatedItems,
        total: recalcTotal(updatedItems),
      };
    }

    case "CLEAR_CART": {
      return { items: [], total: 0 };
    }

    default:
      return state;
  }
};

const CartContext = createContext(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

const getInitialState = () => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], total: 0 };
    const parsed = JSON.parse(raw);
    // basic validation
    return parsed && Array.isArray(parsed.items)
      ? parsed
      : { items: [], total: 0 };
  } catch (e) {
    console.warn("Failed to parse cart from sessionStorage:", e);
    return { items: [], total: 0 };
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(cartReducer, undefined, () =>
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

  // helpers
  const addItem = (menuItem, restaurant) => {
    dispatch({ type: "ADD_ITEM", payload: { menuItem, restaurant } });
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

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id, quantity) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

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
