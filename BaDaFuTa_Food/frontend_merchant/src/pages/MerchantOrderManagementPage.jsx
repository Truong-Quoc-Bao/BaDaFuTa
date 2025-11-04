import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { MerchantOrderCard } from '../components/MerchantOrderCard';
import { useMerchant } from '../contexts/MerchantContext';
import { Clock, Package, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export function MerchantOrderManagementPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const { 
    orders, 
    updateOrderStatus, 
    fetchOrders,
    autoConfirmEnabled,
    toggleAutoConfirm 
  } = useMerchant();

  useEffect(() => {
    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter orders based on tab and search
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (activeTab) {
      case 'pending':
        return order.status === 'pending' && matchesSearch;
      case 'confirmed':
        return order.status === 'confirmed' && matchesSearch;
      case 'preparing':
        return order.status === 'preparing' && matchesSearch;
      case 'ready':
        return order.status === 'ready' && matchesSearch;
      case 'completed':
        return order.status === 'delivered' && matchesSearch;
      case 'cancelled':
        return order.status === 'cancelled' && matchesSearch;
      default:
        return matchesSearch;
    }
  });

  const getTabCount = (status) => {
    switch (status) {
      case 'pending':
        return orders.filter(o => o.status === 'pending').length;
      case 'confirmed':
        return orders.filter(o => o.status === 'confirmed').length;
      case 'preparing':
        return orders.filter(o => o.status === 'preparing').length;
      case 'ready':
        return orders.filter(o => o.status === 'ready').length;
      case 'completed':
        return orders.filter(o => o.status === 'delivered').length;
      case 'cancelled':
        return orders.filter(o => o.status === 'cancelled').length;
      default:
        return 0;
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Đã cập nhật trạng thái đơn hàng thành công`);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2>Quản lý đơn hàng</h2>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tất cả đơn hàng của nhà hàng
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button
            variant={autoConfirmEnabled ? "default" : "outline"}
            onClick={toggleAutoConfirm}
            className="whitespace-nowrap"
          >
            {autoConfirmEnabled ? 'Tắt tự động xác nhận' : 'Bật tự động xác nhận'}
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Chờ xác nhận</p>
                <p className="text-2xl font-bold">{getTabCount('pending')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Đã xác nhận</p>
                <p className="text-2xl font-bold">{getTabCount('confirmed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Đang chuẩn bị</p>
                <p className="text-2xl font-bold">{getTabCount('preparing')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Sẵn sàng</p>
                <p className="text-2xl font-bold">{getTabCount('ready')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Hoàn thành</p>
                <p className="text-2xl font-bold">{getTabCount('completed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Đã hủy</p>
                <p className="text-2xl font-bold">{getTabCount('cancelled')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Chờ xác nhận</span>
            <span className="sm:hidden">Chờ</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('pending')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Đã xác nhận</span>
            <span className="sm:hidden">Xác nhận</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('confirmed')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="preparing" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Đang chuẩn bị</span>
            <span className="sm:hidden">Chuẩn bị</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('preparing')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="ready" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Sẵn sàng</span>
            <span className="sm:hidden">Sẵn sàng</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('ready')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Hoàn thành</span>
            <span className="sm:hidden">Xong</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('completed')}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Đã hủy</span>
            <span className="sm:hidden">Hủy</span>
            <Badge variant="secondary" className="ml-1">
              {getTabCount('cancelled')}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Không có đơn hàng</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? 'Không tìm thấy đơn hàng phù hợp với từ khóa tìm kiếm.' : 'Chưa có đơn hàng nào trong trạng thái này.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filteredOrders.map((order) => (
                    <MerchantOrderCard
                      key={order.id}
                      order={order}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}