import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, MapPin, Phone, User, FileText } from 'lucide-react';
import { useMerchant } from '../contexts/MerchantContext';
import { toast } from 'sonner';

export function MerchantOrderCard({ order, onStatusUpdate }) {
  const { updateOrderStatus, cancelOrder } = useMerchant();

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Chờ xác nhận', variant: 'secondary' },
      confirmed: { label: 'Đã xác nhận', variant: 'default' },
      preparing: { label: 'Đang chuẩn bị', variant: 'default' },
      'on-way': { label: 'Đang giao', variant: 'default' },
      delivered: { label: 'Đã giao', variant: 'outline' },
      cancelled: { label: 'Đã hủy', variant: 'destructive' }
    };
    return statusMap[status];
  };

  const handleConfirmOrder = () => {
    updateOrderStatus(order.id, 'confirmed');
    onStatusUpdate?.(order.id, 'confirmed');
    toast.success('Đã xác nhận đơn hàng');
  };

  const handleStartPreparing = () => {
    updateOrderStatus(order.id, 'preparing');
    onStatusUpdate?.(order.id, 'preparing');
    toast.success('Bắt đầu chuẩn bị đơn hàng');
  };

  const handleMarkReady = () => {
    updateOrderStatus(order.id, 'ready');
    onStatusUpdate?.(order.id, 'ready');
    toast.success('Đơn hàng đã sẵn sàng giao');
  };

  const handleCancelOrder = () => {
    if (confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      const reason = prompt('Lý do hủy đơn:') || 'Merchant hủy đơn';
      cancelOrder(order.id, reason);
      toast.success('Đã hủy đơn hàng');
    }
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const statusInfo = getStatusBadge(order.status);

  return (
    <Card className="mb-4 hover:scale-100">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Đơn hàng #{order.id}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(order.orderTime)}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {order.customerName}
              </div>
              <div className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                {order.customerPhone}
              </div>
            </div>
          </div>
          <Badge variant={statusInfo.variant}>
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Danh sách món ăn */}
        <div className="mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
              <div className="flex-1">
                <div className="font-medium">{item.menuItem.name}</div>
                <div className="text-sm text-muted-foreground">
                  Số lượng: {item.quantity}
                  {item.selectedToppings && item.selectedToppings.length > 0 && (
                    <span className="ml-2">
                      Topping: {item.selectedToppings.map(t => t.name).join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <div className="font-medium">
                {formatCurrency(item.menuItem.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {/* Thông tin giao hàng */}
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <div className="font-medium">Địa chỉ giao hàng:</div>
              <div className="text-sm text-muted-foreground">{order.deliveryAddress}</div>
            </div>
          </div>
          {order.notes && (
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 text-muted-foreground" />
              <div>
                <div className="font-medium">Ghi chú:</div>
                <div className="text-sm text-muted-foreground">{order.notes}</div>
              </div>
            </div>
          )}
        </div>

        {/* Tổng tiền */}
        <div className="flex justify-between items-center mb-4 p-3  bg-gray-100 rounded-lg">
          <span className="font-semibold">Tổng cộng:</span>
          <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {order.status === 'pending' && (
            <>
              <Button variant="default" onClick={handleConfirmOrder} className="">
                Xác nhận đơn hàng
              </Button>
              <Button variant="destructive" onClick={handleCancelOrder}>
                Hủy đơn
              </Button>
            </>
          )}
          
          {order.status === 'confirmed' && (
            <>
              <Button variant="default"  onClick={handleStartPreparing} className="">
                Bắt đầu chuẩn bị
              </Button>
              <Button variant="destructive" onClick={handleCancelOrder}>
                Hủy đơn
              </Button>
            </>
          )}
          
          {order.status === 'preparing' && (
            <Button onClick={handleMarkReady} className="">
              Sẵn sàng giao hàng
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}