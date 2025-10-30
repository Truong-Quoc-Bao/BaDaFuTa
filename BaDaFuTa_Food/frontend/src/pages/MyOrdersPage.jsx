import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { OrderHistoryCard } from "../components/OrderHistoryCard";
// import { ProtectedRoute } from "../components/ProtectedRoute";
import { ShoppingBag, Package2, X, Clock } from "lucide-react";
import { orderHistory as initialOrderHistory } from "../../data/mockData";

export const MyOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(initialOrderHistory);

  const handleRatingSubmit = (rating) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === rating.orderId
          ? {
              ...order,
              rating: rating.rating,
              review: rating.review,
              canRate: false,
            }
          : order
      )
    );
  };

  // Filter orders by status
  const deliveredOrders = useMemo(
    () => orders.filter((order) => order.status === "delivered"),
    [orders]
  );

  const shippingOrders = useMemo(
    () =>
      orders.filter(
        (order) => order.status === "shipping" || order.status === "confirmed"
      ),
    [orders]
  );

  const cancelledOrders = useMemo(
    () => orders.filter((order) => order.status === "cancelled"),
    [orders]
  );
    
//    const ratingOrders = useMemo(
//     () => orders.fillter((order) => order.status === "rating"),
//     [orders]
//   );


  const EmptyState = ({ type, icon: Icon, message }) => (
    <Card className="hover:scale-100">
      <CardContent className="text-center py-12">
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="font-semibold text-lg mb-2">{message}</h3>
        <p className="text-gray-500 mb-6">
          {type === "shipping" &&
            "Bạn chưa có đơn hàng nào đang được giao. Hãy đặt hàng ngay!"}
          {type === "delivered" &&
            "Bạn chưa có đơn hàng nào đã mua. Khám phá các nhà hàng ngon ngay!"}
          {type === "cancelled" &&
            "Bạn chưa có đơn hàng nào bị hủy. Thật tuyệt vời!"}
        </p>
        <Button
          onClick={() => navigate("/")}
          className="bg-orange-500 hover:bg-orange-600"
        >
          Khám phá nhà hàng
        </Button>
      </CardContent>
    </Card>
  );

  return (
    // <ProtectedRoute>
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Đơn hàng của tôi</h1>
        <p className="text-gray-600">
          Theo dõi và quản lý các đơn hàng của bạn
        </p>
      </div>

      <Tabs defaultValue="delivered" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shipping" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Đang giao ({shippingOrders.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="delivered"
            className="flex items-center space-x-2"
          >
            <Package2 className="w-4 h-4" />
            <span>Đã giao ({deliveredOrders.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="cancelled"
            className="flex items-center space-x-2"
          >
            <X className="w-4 h-4" />
            <span>Đã hủy ({cancelledOrders.length})</span>
          </TabsTrigger>
          {/* <TabsTrigger
            value="delivered"
            className="flex items-center space-x-2"
          >
            <Package2 className="w-4 h-4" />
            <span>Đánh giá ({ratingOrders.length})</span>
          </TabsTrigger> */}
        </TabsList>

        <TabsContent value="delivered" className="space-y-4">
          {deliveredOrders.length > 0 ? (
            deliveredOrders.map((order) => (
              <OrderHistoryCard
                key={order.id}
                order={order}
                onRatingSubmit={handleRatingSubmit}
              />
            ))
          ) : (
            <EmptyState
              type="delivered"
              icon={Package2}
              message="Chưa có đơn hàng mua"
            />
          )}
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          {shippingOrders.length > 0 ? (
            shippingOrders.map((order) => (
              <OrderHistoryCard
                key={order.id}
                order={order}
                onRatingSubmit={handleRatingSubmit}
              />
            ))
          ) : (
            <EmptyState
              type="shipping"
              icon={Clock}
              message="Chưa có đơn hàng đang giao"
            />
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledOrders.length > 0 ? (
            cancelledOrders.map((order) => (
              <OrderHistoryCard
                key={order.id}
                order={order}
                onRatingSubmit={handleRatingSubmit}
              />
            ))
          ) : (
            <EmptyState
              type="cancelled"
              icon={X}
              message="Chưa có đơn hàng hủy"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
    // </ProtectedRoute>
  );
};
