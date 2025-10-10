import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea.jsx';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

export const ToppingSelectionDialog = ({ isOpen, onClose, menuItem, restaurant, quantity }) => {
  const { addItemWithToppings } = useCart();
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Check if item is available
  const isAvailable = menuItem.isAvailable !== false;

  const handleToppingChange = (topping, checked) => {
    if (checked) {
      setSelectedToppings(prev => [...prev, topping]);
    } else {
      setSelectedToppings(prev => prev.filter(t => t.id !== topping.id));
    }
  };

  const handleAddToCart = () => {
    // E1: Check if product is available
    if (!isAvailable) {
      toast.error('Sản phẩm đã hết hàng/ngừng kinh doanh, vui lòng chọn sản phẩm khác.');
      return;
    }

    // E2: Check required toppings
    const requiredToppings = menuItem.toppings?.filter(t => t.required) || [];
    const selectedRequiredToppings = selectedToppings.filter(t => t.required);
    
    if (requiredToppings.length > 0 && selectedRequiredToppings.length !== requiredToppings.length) {
      toast.error('Vui lòng chọn topping/tùy chọn đầy đủ.');
      return;
    }

    // Add to cart with selected toppings
    for (let i = 0; i < quantity; i++) {
      addItemWithToppings(menuItem, restaurant, selectedToppings, specialInstructions);
    }

    toast.success(`Đã thêm ${quantity} ${menuItem.name} vào giỏ hàng`);
    onClose();
    setSelectedToppings([]);
    setSpecialInstructions('');
  };

  const toppingsTotalPrice = selectedToppings.reduce((sum, topping) => sum + topping.price, 0);
  const itemTotalPrice = (menuItem.price + toppingsTotalPrice) * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] overflow-y-auto mx-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Tùy chọn món ăn</DialogTitle>
          <DialogDescription>
            Chọn topping và số lượng để thêm món ăn vào giỏ hàng.
          </DialogDescription>
        </DialogHeader>

        {/* Product Info */}
        <div className="flex items-start space-x-4 py-4">
          <ImageWithFallback 
            src={menuItem.image} 
            alt={menuItem.name}
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{menuItem.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{menuItem.description}</p>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-orange-600">
                {menuItem.price.toLocaleString('vi-VN')}đ
              </span>
              {!isAvailable && (
                <Badge variant="destructive">Hết hàng</Badge>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Quantity Display */}
        <div className="flex justify-between items-center py-2">
          <span className="font-medium">Số lượng:</span>
          <span className="font-semibold">{quantity}</span>
        </div>

        {/* Toppings Selection */}
        {menuItem.toppings && menuItem.toppings.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold">Tùy chọn thêm</h4>
              
              {menuItem.toppings.map((topping) => (
                <div key={topping.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={topping.id}
                      checked={selectedToppings.some(t => t.id === topping.id)}
                      onCheckedChange={(checked) => handleToppingChange(topping, checked)}
                      disabled={!isAvailable}
                    />
                    <Label htmlFor={topping.id} className="flex items-center space-x-2">
                      <span>{topping.name}</span>
                      {topping.required && (
                        <Badge variant="outline" className="text-xs">Bắt buộc</Badge>
                      )}
                    </Label>
                  </div>
                  <span className="text-sm font-medium">
                    +{topping.price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Special Instructions */}
        <div className="space-y-2">
          <Label htmlFor="instructions">Ghi chú đặc biệt (tùy chọn)</Label>
          <Textarea
            id="instructions"
            placeholder="Ví dụ: Ít cay, không hành..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            disabled={!isAvailable}
            rows={3}
          />
        </div>

        {/* Price Summary */}
        <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between">
            <span>Giá món ăn ({quantity} x {menuItem.price.toLocaleString('vi-VN')}đ)</span>
            <span>{(menuItem.price * quantity).toLocaleString('vi-VN')}đ</span>
          </div>
          
          {selectedToppings.length > 0 && (
            <div className="flex justify-between">
              <span>Toppings ({quantity} x {toppingsTotalPrice.toLocaleString('vi-VN')}đ)</span>
              <span>{(toppingsTotalPrice * quantity).toLocaleString('vi-VN')}đ</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng</span>
            <span className="text-orange-600">{itemTotalPrice.toLocaleString('vi-VN')}đ</span>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Hủy
          </Button>
          <Button 
            onClick={handleAddToCart} 
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
            disabled={!isAvailable}
          >
            {isAvailable ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
