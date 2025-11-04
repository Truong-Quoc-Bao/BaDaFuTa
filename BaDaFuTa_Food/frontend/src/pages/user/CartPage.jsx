import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useCart } from "../../contexts/CartContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { useAuth } from "../../contexts/AuthContext"; // 🔹 import auth
import { toast } from "sonner";

export default function CartPage() {
  const navigate = useNavigate();

  const { state: authState } = useAuth(); // 🔹 lấy user info
  //const user = authState.user; // 🔹 check login

  //lấy giỏ hàng
  const { state, updateQuantity, removeItem, clearCart } = useCart();
  const deliveryFee =
    state.items.length > 0
      ? state.items[0].restaurant?.deliveryFee ??
        state.items[0].restaurant?.delivery_fee ??
        0
      : 0;
  const subtotal = state.total;
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    // E3: Check if cart is empty
    if (!state.items || state.items.length === 0) {
      toast.error("Giỏ hàng rỗng, hãy thêm sản phẩm.");
      return;
    } else {
      if (!authState.isAuthenticated) {
        localStorage.setItem("redirectAfterLogin", "/cart/checkout");
        navigate("/login");
        return;
      }
      navigate("/cart/checkout");
    }
  };
  

  if (state.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8  ">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6 bg-white border border-gray-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>

        <div className="text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-500 mb-6">
            Hãy thêm một số món ăn vào giỏ hàng của bạn
          </p>
          <Button
            variant="default"
            onClick={() => navigate("/")}
            className="bg-orange-500 hover:bg-orange-600 w-[180px] h-[40px] rounded-lg"
          >
            Khám phá nhà hàng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
      <Button
        variant="outline"
        onClick={() => navigate("/")}
        className="mb-6 bg-white"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Quay lại
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Giỏ hàng của bạn</h1>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 bg-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa tất cả
            </Button>
          </div>

          <div className="space-y-4">
            {state.items.map((item) => {
              const toppingsTotal = (item.selectedToppings || []).reduce(
                (sum, t) => sum + t.price,
                0
              );
              const itemPrice = item.menuItem.price + toppingsTotal;

              return (
                <Card key={item.id} className="hover:scale-100">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <ImageWithFallback
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold">{item.menuItem.name}</h3>
                        <p className="text-sm text-gray-600">
                          Tên nhà hàng: {item.restaurant.name}
                        </p>

                        {/* Display selected toppings */}
                        {item.selectedToppings &&
                          item.selectedToppings.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {item.selectedToppings.map((topping) => (
                                <Badge
                                  key={topping.id}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {topping.name}{" "}
                                  {topping.price > 0 &&
                                    `+${topping.price.toLocaleString(
                                      "vi-VN"
                                    )}đ`}
                                </Badge>
                              ))}
                            </div>
                          )}

                        {/* Display special instructions */}
                        {item.specialInstructions && (
                          <p className="text-xs text-gray-500 mt-2 italic">
                            Ghi chú: {item.specialInstructions}
                          </p>
                        )}

                        <div className="mt-2">
                          <div className="flex flex-col">
                            <span className="font-bold text-orange-600">
                              {item.menuItem.price.toLocaleString("vi-VN")}đ
                            </span>
                            {toppingsTotal > 0 && (
                              <span className="text-sm text-gray-600">
                                + toppings:{" "}
                                {toppingsTotal.toLocaleString("vi-VN")}đ
                              </span>
                            )}
                            {/* <span className="text-sm font-semibold text-gray-800">
                              = {itemPrice.toLocaleString("vi-VN")}đ/món
                            </span> */}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-3">
                        {/* Quantity controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Item total */}
                        <div className="text-right">
                          <p className="font-bold text-orange-600">
                            {(itemPrice * item.quantity).toLocaleString(
                              "vi-VN"
                            )}
                            đ
                          </p>
                        </div>

                        {/* Remove button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Order Summary - Step 8 from Use Case */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 hover:scale-100">
            <CardHeader>
              <CardTitle>Tóm tắt đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>
                  Tạm tính (
                  {state.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  món)
                </span>
                <span>{subtotal.toLocaleString("vi-VN")}đ</span>
              </div>

              <div className="flex justify-between">
                <span>Phí giao hàng</span>
                <span>{deliveryFee.toLocaleString("vi-VN")}đ</span>
              </div>

              <hr className="border-t border-gray-200 my-4" />

              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-orange-600">
                  {total.toLocaleString("vi-VN")}đ
                </span>
              </div>

              {/* Step 11-12 from Use Case: Checkout button */}
              <Button
                onClick={handleCheckout}
                className="w-full bg-orange-500 hover:bg-orange-600"
                size="lg"
              >
                Tiến hành thanh toán
              </Button>

              {/* <p className="text-xs text-gray-500 text-center">
                * Giá có thể thay đổi tùy theo chính sách của từng nhà hàng
              </p> */}
              <br />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
