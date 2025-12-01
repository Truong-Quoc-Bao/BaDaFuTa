import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, MapPin, Phone, User, FileText } from 'lucide-react';
import { useMerchant } from '../contexts/MerchantContext';
import { toast } from 'sonner';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export function MerchantOrderCard({ order, onStatusUpdate }) {
  const { updateOrderStatus, cancelOrder } = useMerchant();

  // Thêm state loading riêng cho từng card
  const [loadingStatus, setLoadingStatus] = useState(null); // 'CONFIRMED' | 'PREPARING' | 'READY' | null
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);

  const getStatusBadge = (status) => {
    const statusMap = {
      PENDING: { label: 'Chờ xác nhận', variant: 'secondary' },
      CONFIRMED: { label: 'Đã xác nhận', variant: 'default' },
      PREPARING: { label: 'Đang chuẩn bị', variant: 'default' },
      'on-way': { label: 'Đang giao', variant: 'default' },
      COMPLETED: { label: 'Đã giao', variant: 'outline' },
      CANCELED: { label: 'Đã hủy', variant: 'destructive' },
    };
    return statusMap[status] || { label: 'Không xác định', variant: 'secondary' };
  };

  // Hàm xác nhận đơn – mượt như ShopeeFood
  const handleConfirmOrder = async () => {
    if (window.voiceInterval) {
      clearInterval(window.voiceInterval);
      window.voiceInterval = null;
      window.speechSynthesis.cancel();
    }

    setLoadingStatus('CONFIRMED');

    // Optimistic update – đơn bay liền!
    onStatusUpdate?.(order.id, 'CONFIRMED');

    try {
      await updateOrderStatus(order.id, 'CONFIRMED', '', order);
      toast.success('Đã xác nhận đơn hàng thành công!');
    } catch (error) {
      // Rollback nếu lỗi
      onStatusUpdate?.(order.id, 'PENDING');
      toast.error('Xác nhận thất bại, vui lòng thử lại');
    } finally {
      setLoadingStatus(null);
    }
  };
  // Các hàm khác (có thể thêm loading tương tự)
  const handleStartPreparing = async () => {
    setLoadingStatus('PREPARING');
    onStatusUpdate?.(order.id, 'PREPARING');
    try {
      await updateOrderStatus(order.id, 'PREPARING');
      toast.success('Bắt đầu chuẩn bị đơn hàng');
    } catch {
      onStatusUpdate?.(order.id, 'CONFIRMED');
      toast.error('Cập nhật thất bại');
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleMarkReady = async () => {
    setLoadingStatus('READY');
    onStatusUpdate?.(order.id, 'READY');
    try {
      await updateOrderStatus(order.id, 'READY');
      toast.success('Đơn hàng đã sẵn sàng!');
    } catch {
      onStatusUpdate?.(order.id, 'PREPARING');
      toast.error('Cập nhật thất bại');
    } finally {
      setLoadingStatus(null);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) return;

    let finalReason = cancelReason;
    if (!finalReason || finalReason === 'Lý do khác (ghi chú)') {
      finalReason = prompt('Nhập lý do hủy đơn:', cancelReason) || 'Merchant hủy đơn';
    }

    if (!finalReason) return;

    try {
      await updateOrderStatus(order.id, 'CANCELED', finalReason);
      onStatusUpdate?.(order.id, 'CANCELED');
      toast.success('Đã hủy đơn hàng');
      setCancelReason(''); // reset
    } catch (error) {
      toast.error('Hủy đơn thất bại');
    }
  };

  const CANCEL_REASONS = [
    'Quán hết món / nguyên liệu',
    'Quán tạm nghỉ / đóng cửa',
    'Khách đặt nhầm món',
    'Khách hủy đơn',
    'Quán quá tải, không kịp giao',
    'Khách không nghe máy',
    'Địa chỉ giao không hợp lệ / xa quá',
    'Thời tiết xấu, không thể giao',
    'Lỗi hệ thống / đơn trùng',
    'Lý do khác (ghi chú)',
  ];

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount) => {
    if (amount == null) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const statusInfo = getStatusBadge(order.status);

  return (
    <Card className="mb-4 hover:scale-100">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">Đơn hàng #{order.id || '---'}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2 sm:gap-1 bg-gray-50 p-2 rounded-md shadow-sm">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-gray-700">Đặt lúc:</span>
                <span className="text-gray-900">{formatTime(order.created_at)}</span>
              </div>

              <div className="flex items-center gap-2 sm:gap-1 bg-gray-50 p-2 rounded-md shadow-sm">
                <User className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-gray-700">Tên khách hàng:</span>
                <span className="text-gray-900">
                  {order.fullname || order.user_name || 'Khách vãng lai'}
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-1 bg-gray-50 p-2 rounded-md shadow-sm">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="font-medium text-gray-700">Số điện thoại khách hàng:</span>
                <span className="text-gray-900">
                  {order.phone || order.user_phone || 'Không có số'}
                </span>
              </div>
            </div>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Danh sách món ăn */}
        <div className="mb-4">
          {order.items.map((item) => (
            <div
              key={item.id || item.menu_item_id || `fallback-${order.id}-${index}`}
              className="flex justify-between items-center py-2 border-b last:border-b-0"
            >
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  Số lượng: {item.quantity || 0}
                  {item.selectedToppings && item.selectedToppings.length > 0 && (
                    <span className="ml-2">
                      Topping: {item.selectedToppings.map((t) => t.name).join(', ')}
                    </span>
                  )}
                </div>
              </div>
              <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>

        {/* Thông tin giao hàng */}
        <div className="mb-4 p-3 bg-gray-100 rounded-lg">
          <div className="flex items-start gap-2 mb-2">
            <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
            <div>
              <div className="font-medium">Địa chỉ giao hàng:</div>
              <div className="text-sm text-muted-foreground">{order.delivery_address}</div>
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
          <span className="font-bold text-primary">
            {formatCurrency(order.total_amount + (order.delivery_fee || 0))}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          {order.status === 'PENDING' && (
            <>
              <Button
                variant="default"
                onClick={handleConfirmOrder}
                disabled={loadingStatus === 'CONFIRMED'}
                className="font-medium min-w-44 relative"
              >
                {loadingStatus === 'CONFIRMED' ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xác nhận...</span>
                    </div>
                  </>
                ) : (
                  'Xác nhận đơn hàng'
                )}
              </Button>

              {/* Hủy đơn – chỉ hiện nút trước, bấm mới hiện dropdown */}
              <div className="flex gap-2 items-center">
                {!isCanceling ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setIsCanceling(true);
                      setSelectOpen(true); // mở dropdown
                    }}
                    className="font-medium"
                  >
                    Hủy đơn
                  </Button>
                ) : (
                  <>
                    <Select
                      value={cancelReason}
                      onValueChange={setCancelReason}
                      open={selectOpen} // kiểm soát dropdown mở
                      onOpenChange={setSelectOpen} // khi người dùng click ngoài dropdown
                    >
                      <SelectTrigger className="w-72">
                        <SelectValue placeholder="Chọn lý do hủy" />
                      </SelectTrigger>
                      <SelectContent>
                        {CANCEL_REASONS.map((reason) => (
                          <SelectItem key={reason} value={reason}>
                            {reason}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Button
                      variant="destructive"
                      onClick={handleCancelOrder}
                      disabled={!cancelReason || loadingStatus !== null}
                    >
                      Xác nhận hủy
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsCanceling(false);
                        setCancelReason('');
                        setSelectOpen(false);
                      }}
                    >
                      Hủy bỏ
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
          {order.status === 'CONFIRMED' && (
            <>
              <Button variant="default" onClick={handleStartPreparing} className="">
                Bắt đầu chuẩn bị
              </Button>
              <Button variant="destructive" onClick={handleCancelOrder}>
                Hủy đơn
              </Button>
            </>
          )}

          {order.status === 'PREPARING' && (
            <Button onClick={handleMarkReady} className="">
              Sẵn sàng giao hàng
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
