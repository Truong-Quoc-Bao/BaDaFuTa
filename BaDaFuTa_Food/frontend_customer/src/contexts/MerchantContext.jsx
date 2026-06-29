import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const MerchantContext = createContext(undefined);

export function MerchantProvider({ children }) {
  // Mock merchant settings - trong thực tế sẽ lấy từ API
  const [merchantSettings, setMerchantSettings] = useState({
    restaurantId: "rest-1",
    autoConfirmOrders: false,
    maxOrdersPerHour: 20,
    operatingHours: {
      open: "08:00",
      close: "22:00",
    },
  });

  // Merchant auth state
  const [merchantAuth, setMerchantAuth] = useState(null);

  // Initialize merchant auth from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("merchantAuth");
      if (stored) {
        setMerchantAuth(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading merchant auth:", error);
      localStorage.removeItem("merchantAuth");
    }
  }, []);

  // Mock orders - trong thực tế sẽ lấy từ API
  const [orders, setOrders] = useState([
    {
      id: "order-1",
      items: [
        {
          id: "item-1",
          menuItem: {
            id: "menu-1",
            name: "Bánh Mì Thịt Nướng",
            description: "Bánh mì thịt nướng thơm ngon với rau tươi",
            price: 35000,
            image:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
            category: "Bánh mì",
            restaurantId: "rest-1",
          },
          quantity: 2,
          restaurant: {
            id: "rest-1",
            name: "Bánh Mì Sài Gòn",
            image:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
            cuisine: "Việt Nam",
            rating: 4.5,
            deliveryTime: "15-25 phút",
            deliveryFee: 15000,
            description: "Bánh mì truyền thống Sài Gòn",
            location: "Quận 1, TP.HCM",
          },
        },
      ],
      total: 85000,
      status: "pending",
      orderTime: new Date(Date.now() - 5 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 25 * 60 * 1000),
      deliveryAddress: "123 Nguyễn Huệ, Quận 1, TP.HCM",
      customerName: "Nguyễn Văn A",
      customerPhone: "0901234567",
      notes: "Không cay",
      restaurantId: "rest-1",
    },
    {
      id: "order-2",
      items: [
        {
          id: "item-2",
          menuItem: {
            id: "menu-2",
            name: "Cơm Tấm Sườn Nướng",
            description: "Cơm tấm sườn nướng đặc biệt",
            price: 55000,
            image:
              "https://images.unsplash.com/photo-1583032328304-c8f4a3a2d5e3?w=300&h=200&fit=crop",
            category: "Cơm",
            restaurantId: "rest-1",
          },
          quantity: 1,
          restaurant: {
            id: "rest-1",
            name: "Bánh Mì Sài Gòn",
            image:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
            cuisine: "Việt Nam",
            rating: 4.5,
            deliveryTime: "15-25 phút",
            deliveryFee: 15000,
            description: "Bánh mì truyền thống Sài Gòn",
            location: "Quận 1, TP.HCM",
          },
        },
      ],
      total: 70000,
      status: "confirmed",
      orderTime: new Date(Date.now() - 15 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000),
      deliveryAddress: "456 Lê Lợi, Quận 1, TP.HCM",
      customerName: "Trần Thị B",
      customerPhone: "0907654321",
      restaurantId: "rest-1",
    },
    {
      id: "order-3",
      items: [
        {
          id: "item-3",
          menuItem: {
            id: "menu-3",
            name: "Phở Bò Tái",
            description: "Phở bò tái truyền thống",
            price: 45000,
            image:
              "https://images.unsplash.com/photo-1573225342350-16731dd9bf3d?w=300&h=200&fit=crop",
            category: "Phở",
            restaurantId: "rest-1",
          },
          quantity: 1,
          restaurant: {
            id: "rest-1",
            name: "Bánh Mì Sài Gòn",
            image:
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
            cuisine: "Việt Nam",
            rating: 4.5,
            deliveryTime: "15-25 phút",
            deliveryFee: 15000,
            description: "Bánh mì truyền thống Sài Gòn",
            location: "Quận 1, TP.HCM",
          },
        },
      ],
      total: 60000,
      status: "delivered",
      orderTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      estimatedDelivery: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
      deliveryAddress: "789 Nguyễn Trãi, Quận 5, TP.HCM",
      customerName: "Lê Văn C",
      customerPhone: "0912345678",
      restaurantId: "rest-1",
    },
  ]);

  const updateMerchantSettings = (newSettings) => {
    setMerchantSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  };

  const cancelOrder = (orderId, reason) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status: "cancelled", notes: reason }
          : order
      )
    );
  };

  const fetchOrders = useCallback(() => {
    // Mock fetch - trong thực tế sẽ gọi API
    console.log("Fetching orders...");
  }, []);

  const toggleAutoConfirm = useCallback(() => {
    setMerchantSettings((prev) => ({
      ...prev,
      autoConfirmOrders: !prev.autoConfirmOrders,
    }));
  }, []);

  const logout = useCallback(() => {
    setMerchantAuth(null);
    localStorage.removeItem("merchantAuth");
  }, []);

  return (
    <MerchantContext.Provider
      value={{
        merchantSettings,
        updateMerchantSettings,
        orders,
        updateOrderStatus,
        cancelOrder,
        fetchOrders,
        autoConfirmEnabled: merchantSettings.autoConfirmOrders,
        toggleAutoConfirm,
        merchantAuth,
        logout,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
}

export function useMerchant() {
  const context = useContext(MerchantContext);
  if (!context) {
    throw new Error("useMerchant must be used within a MerchantProvider");
  }
  return context;
}
