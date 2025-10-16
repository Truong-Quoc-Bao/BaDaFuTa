// import { createContext, useContext, useReducer } from 'react';

// const cartReducer = (state, action) => {
//   switch (action.type) {
//     case 'ADD_ITEM': {
//       const { menuItem, restaurant, selectedToppings = [], specialInstructions = '' } = action.payload;
      
//       // Calculate item price including toppings
//       const toppingsPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
//       const itemPrice = menuItem.price + toppingsPrice;
      
//       // Check for existing identical item (same menu item, toppings, and instructions)
//       const existingItem = state.items.find(item => 
//         item.menuItem.id === menuItem.id &&
//         JSON.stringify(item.selectedToppings) === JSON.stringify(selectedToppings) &&
//         item.specialInstructions === specialInstructions
//       );
      
//       if (existingItem) {
//         const updatedItems = state.items.map(item =>
//           item.id === existingItem.id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//         return {
//           ...state,
//           items: updatedItems,
//           total: updatedItems.reduce((sum, item) => {
//             const toppingsTotal = (item.selectedToppings || []).reduce((tSum, t) => tSum + t.price, 0);
//             return sum + ((item.menuItem.price + toppingsTotal) * item.quantity);
//           }, 0)
//         };
//       }
      
//       const newItem = {
//         id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
//         menuItem,
//         restaurant,
//         quantity: 1,
//         selectedToppings,
//         specialInstructions
//       };
      
//       const newItems = [...state.items, newItem];
//       return {
//         ...state,
//         items: newItems,
//         total: newItems.reduce((sum, item) => {
//           const toppingsTotal = (item.selectedToppings || []).reduce((tSum, t) => tSum + t.price, 0);
//           return sum + ((item.menuItem.price + toppingsTotal) * item.quantity);
//         }, 0)
//       };
//     }
    
//     case 'REMOVE_ITEM': {
//       const newItems = state.items.filter(item => item.id !== action.payload);
//       return {
//         ...state,
//         items: newItems,
//         total: newItems.reduce((sum, item) => {
//           const toppingsTotal = (item.selectedToppings || []).reduce((tSum, t) => tSum + t.price, 0);
//           return sum + ((item.menuItem.price + toppingsTotal) * item.quantity);
//         }, 0)
//       };
//     }
    
//     case 'UPDATE_QUANTITY': {
//       const { id, quantity } = action.payload;
//       if (quantity <= 0) {
//         return cartReducer(state, { type: 'REMOVE_ITEM', payload: id });
//       }
      
//       const updatedItems = state.items.map(item =>
//         item.id === id ? { ...item, quantity } : item
//       );
//       return {
//         ...state,
//         items: updatedItems,
//         total: updatedItems.reduce((sum, item) => {
//           const toppingsTotal = (item.selectedToppings || []).reduce((tSum, t) => tSum + t.price, 0);
//           return sum + ((item.menuItem.price + toppingsTotal) * item.quantity);
//         }, 0)
//       };
//     }
    
//     case 'CLEAR_CART':
//       return { items: [], total: 0 };
    
//     default:
//       return state;
//   }
// };

// const CartContext = createContext(undefined);

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

//   const addItem = (menuItem, restaurant) => {
//     dispatch({ type: 'ADD_ITEM', payload: { menuItem, restaurant } });
//   };

//   const addItemWithToppings = (menuItem, restaurant, selectedToppings, specialInstructions) => {
//     dispatch({ type: 'ADD_ITEM', payload: { menuItem, restaurant, selectedToppings, specialInstructions } });
//   };

//   const removeItem = (id) => {
//     dispatch({ type: 'REMOVE_ITEM', payload: id });
//   };

//   const updateQuantity = (id, quantity) => {
//     dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
//   };

//   const clearCart = () => {
//     dispatch({ type: 'CLEAR_CART' });
//   };

//   return (
//     <CartContext.Provider value={{ state, dispatch, addItem, addItemWithToppings, removeItem, updateQuantity, clearCart }}>
//       {children}
//     </CartContext.Provider>
//   );
// };






import { createContext, useContext, useReducer } from "react";

// Reducer xử lý actions
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const {
        menuItem,
        restaurant,
        selectedToppings = [],
        specialInstructions = "",
      } = action.payload;

      const existingItem = state.items.find(
        (item) =>
          item.menuItem.id === menuItem.id &&
          JSON.stringify(item.selectedToppings) ===
            JSON.stringify(selectedToppings) &&
          item.specialInstructions === specialInstructions
      );

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        return {
          ...state,
          items: updatedItems,
          total: calcTotal(updatedItems),
        };
      }

      const newItem = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        menuItem,
        restaurant,
        quantity: 1,
        selectedToppings,
        specialInstructions,
      };

      const newItems = [...state.items, newItem];
      return { ...state, items: newItems, total: calcTotal(newItems) };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload);
      return { ...state, items: newItems, total: calcTotal(newItems) };
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload;
      if (quantity <= 0)
        return cartReducer(state, { type: "REMOVE_ITEM", payload: id });

      const updatedItems = state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      return { ...state, items: updatedItems, total: calcTotal(updatedItems) };
    }

    case "CLEAR_CART":
      return { items: [], total: 0 };

    default:
      return state;
  }
};

// Helper tính tổng tiền
const calcTotal = (items) =>
  items.reduce((sum, item) => {
    const toppingsTotal = (item.selectedToppings || []).reduce(
      (tSum, t) => tSum + t.price,
      0
    );
    return sum + (item.menuItem.price + toppingsTotal) * item.quantity;
  }, 0);

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0 });

  const addItem = (
    menuItem,
    restaurant,
    selectedToppings = [],
    specialInstructions = ""
  ) => {
    dispatch({
      type: "ADD_ITEM",
      payload: { menuItem, restaurant, selectedToppings, specialInstructions },
    });
  };

  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", payload: id });
  const updateQuantity = (id, quantity) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
