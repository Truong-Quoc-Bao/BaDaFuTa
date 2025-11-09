import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@radix-ui/react-dialog'; // nếu dùng Radix UI
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Separator } from './ui/separator';
import {
  Star,
  Calendar,
  Truck,
  Tag,
  MapPin,
  Clock,
  Package,
  CreditCard,
  ForkKnife,
  FileText,
} from 'lucide-react';
import { RatingDialog } from './RatingDialog';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export const OrderHistoryCard = ({ order, onRatingSubmit }) => {
  const [showDetails, setShowDetails] = useState(false); // <-- state để bật/tắt chi tiết
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      case 'CONFIRMED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'DELIVERING':
        return 'Đang giao';
      case 'COMPLETED':
        return 'Đã giao';
      case 'CANCELED':
        return 'Đã hủy';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReorder = () => {
    // Clear cart first to avoid mixing orders from different restaurants
    dispatch({ type: 'CLEAR_CART' });

    // Add all items from this order to cart
    order.items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        dispatch({
          type: 'ADD_ITEM',
          payload: {
            restaurant: {
              id: order.merchant_id, // ID quán/nhà hàng
              name: order.merchant.merchant_name, // Tên quán
              image: order.merchant.profile_image.url, // Ảnh quán
            },
            menuItem: {
              id: item.menu_item.id, // ID món
              name: item.menu_item.name_item, // Tên món
              image: item.menu_item.image_item.url, // Ảnh món
              price: item.menu_item.price, // Giá món
              orderId: item.order_id, // ID đơn hàng gốc
            },
            // quantity: item.quantity, // Số lượng
          },
        });
      }
    });

    // Navigate to cart
    navigate('/cart');
  };

  const handleTrack = () => {
    navigate(`/track-order/${order.id}`, { state: { order } });
  };

  return (
    <>
      <Card className="bg-white rounded-xl p-4 shadow-sm  hover:bg-gray-50 transition-all duration-100 hover:scale-100">
        {/* <Card className="hover:shadow-xs transition-shadow"> */}
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img
                src={order.merchant.profile_image.url}
                alt={order.merchant.merchant_name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <span className="flex items-center space-x-1">
                  <h3 className="font-semibold text-gray-800">Nhà hàng:</h3>
                  <h3 className="text-gray-700">{order.merchant.merchant_name}</h3>
                </span>

                <p className="text-sm text-gray-500">Mã đơn: {order.id}</p>
              </div>
            </div>
            <OrderStatusBadge status={order.status} showIcon={true} />
          </div>
          {/* Chi tiết đơn hàng: chỉ hiển thị khi nhấn nút */}
          {showDetails && (
            <>
              {/* Order Items */}
              <div className="space-y-3 mb-4 ">
                <p className="px-6 text-sm font-semibold">Tóm tắt đơn hàng: </p>
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-lg px-4 py-3 transition-all duration-200 ml-10 shadow-sm text-sm ml-10"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.menu_item.image_item.url}
                        alt={item.menu_item.name_item}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-semibold">
                        {item.quantity} x {item.menu_item.name_item}
                      </span>
                      <p> Option: {" "}
                        {item.options.length > 0
                          ? item.options
                              .map(
                                (opt) => `${opt.option_name}: ${opt.option_item.option_item_name}`,
                              )
                              .join(', ')
                          : 'Không có'}
                      </p>
                    </div>

                    <span>{(item.menu_item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </div>
                ))}
                {/* Phí giao hàng */}
                <div className="flex justify-between mt-3 text-sm text-gray-600 px-2 ml-10">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-blue-500" />
                    <span>Phí giao hàng</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {Number(order.delivery_fee || 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
                {/* Giảm giá */}
                <div className="flex justify-between mt-3 text-sm text-gray-600 px-2 ml-10">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-green-500" />
                    <span>Giảm giá</span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {Number(order.discount || 0).toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Order Info */}
              <div className="space-y-3mb-4">
                <p className="px-6 text-sm font-semibold">Thông tin đơn hàng:</p>
                <div className="flex justify-between mt-3 text-sm text-gray-600 px-2 ml-10">
                  <div className="flex items-center space-x-2">
                    <ForkKnife className="w-4 h-4 text-orange-500" />
                    <span>Dụng cụ ăn uống</span>
                  </div>
                  <span className="font-medium text-gray-800">{order.utensils || 'Không có'}</span>
                </div>
                <div className="flex justify-between mt-3 text-sm text-gray-600 px-2 ml-10">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>Ghi chú</span>
                  </div>
                  <span className="font-medium text-gray-800">{order.note || 'Không có'}</span>
                </div>
                <div className="flex justify-between mt-3 text-sm text-gray-600 px-2 ml-10">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-green-500" />
                    <span>Thời gian đặt hàng</span>
                  </div>
                  <span className="font-medium text-gray-800">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex justify-between mt-3 text-sm text-gray-600 px-2 ml-10">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                    <span>Thanh toán</span>
                  </div>
                  <span className="font-medium text-gray-800">{order.payment_method}</span>
                </div>

                {order.deliveryDate && (
                  <div className="flex justify-between mt-3 text-sm text-gray-600 px-4 ml-10">
                    <span>Giao lúc</span>
                    <span className="font-medium text-gray-800">
                      {formatDate(order.deliveryDate)}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="flex justify-between items-center">
            <div>
              {/* <p className="font-semibold">
                Tổng: {(order.total_amount || 0).toLocaleString("vi-VN")}đ
              </p> */}
              <p className="font-semibold text-lg text-gray-600 text-right mt-4">
                Tổng cộng:{' '}
                <span className="text-gray-600 text-lg">
                  {Number(order.total_amount || 0).toLocaleString('vi-VN')}
                </span>
                <span className="text-lg text-gray-600 ml-1">đ</span>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Existing Rating Display */}
              {order.rating && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{order.rating}</span>
                </div>
              )}

              {/* Rating Button */}
              {order.canRate && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRatingDialog(true)}
                  className="flex items-center space-x-1"
                >
                  <Star className="w-4 h-4" />
                  <span>Đánh giá</span>
                </Button>
              )}

              {/* Nút xem chi tiết */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className=""
              >
                {showDetails ? 'Thu gọn' : 'Xem chi tiết đơn'}
              </Button>
              {/* Reorder Button */}
              {order.status === 'DELIVERING' || order.status === 'CONFIRMED' ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleTrack}
                  className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600 px-4 py-1 rounded-md w-max flex items-center space-x-2 transition"
                >
                  <Truck className="w-4 h-4" />
                  <span>Theo dõi đơn hàng</span>
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReorder}
                  className="bg-orange-500 w-max hover:bg-orange-600 text-white border-orange-500"
                >
                  Đặt lại
                </Button>
              )}
            </div>
          </div>

          {/* Review Display */}
          {order.review && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700 italic">"{order.review}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        order={order}
        onSubmitRating={onRatingSubmit}
      />
    </>
  );
};
