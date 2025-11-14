import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea.jsx";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { toast } from "sonner";

export const ToppingSelectionDialog = ({
  isOpen,
  onClose,
  menuItem,
  restaurant,
  quantity,
}) => {
  const { addItemWithToppings } = useCart();
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");

  // Check if item is available
  const isAvailable = menuItem.isAvailable !== false;

  const handleToppingChange = (options, checked) => {
    if (checked) {
      setSelectedToppings((prev) => [...prev, options]);
    } else {
      setSelectedToppings((prev) => prev.filter((t) => t.id !== options.id));
    }
  };

  const handleAddToCart = () => {
    // E1: Check if product is available
    if (!isAvailable) {
      toast.error(
        "Sản phẩm đã hết hàng/ngừng kinh doanh, vui lòng chọn sản phẩm khác."
      );
      return;
    }

    // E2: Check required toppings
    const requiredToppings = menuItem.options?.filter((t) => t.required) || [];
    const selectedRequiredToppings = selectedToppings.filter((t) => t.required);

    if (
      requiredToppings.length > 0 &&
      selectedRequiredToppings.length !== requiredToppings.length
    ) {
      toast.error("Vui lòng chọn topping/tùy chọn đầy đủ.");
      return;
    }

    // Add to cart with selected toppings
    for (let i = 0; i < quantity; i++) {
      addItemWithToppings(
        menuItem,
        restaurant,
        selectedToppings,
        specialInstructions
      );
    }

    toast.success(`Đã thêm ${quantity} ${menuItem.name} vào giỏ hàng`);
    onClose();
    setSelectedToppings([]);
    setSpecialInstructions("");
  };

  // Khi isOpen thay đổi → reset state
  useEffect(() => {
    if (isOpen) {
      setSelectedToppings([]);
      setSpecialInstructions("");
    }
  }, [isOpen]);

  const toppingsTotalPrice = selectedToppings.reduce(
    (sum, options) => sum + options.price,
    0
  );
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
                {menuItem.price.toLocaleString("vi-VN")}đ
              </span>
              {!isAvailable && <Badge variant="destructive">Hết hàng</Badge>}
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
        {/* {menuItem.options && menuItem.options.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold">Tùy chọn thêm</h4>

              {menuItem.options.map((options) => (
                <div key={options.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={options.id}
                      checked={selectedToppings.some((t) => t.id === options.id)}
                      onCheckedChange={(checked) => handleToppingChange(options, checked)}
                      disabled={!isAvailable}
                    />
                    <Label htmlFor={options.id} className="flex items-center space-x-2">
                      <span>{options.option_name}</span>
                      {options.required && (
                        <Badge variant="outline" className="text-xs">
                          Bắt buộc
                        </Badge>
                      )}
                    </Label>
                  </div>
                  <span className="text-sm font-medium">
                    +{menuItem.options[0].items[0].price.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              ))}
            </div>
          </>
        )} */}

        {/* Options Selection */}
        {menuItem.options && menuItem.options.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <h4 className="font-semibold">Tùy chọn thêm</h4>

              {menuItem.options.map((optionGroup) => (
                <div key={optionGroup.option_id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-semibold">
                      {optionGroup.option_name}
                    </Label>
                    {optionGroup.require_select && (
                      <Badge variant="outline" className="text-xs">
                        Bắt buộc
                      </Badge>
                    )}
                  </div>

                  {/* Hiển thị các lựa chọn trong mỗi nhóm */}
                  {optionGroup.items.map((optItem) => {
                    const isChecked = selectedToppings.some(
                      (t) => t.option_item_id === optItem.option_item_id
                    );

                    return (
                      <div
                        key={optItem.option_item_id}
                        className="flex items-center justify-between ml-4"
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={optItem.option_item_id}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedToppings((prev) => [
                                  ...prev,
                                  {
                                    // 🔥 Thêm 2 field Cart cần
                                    id: optItem.option_item_id,
                                    name: `${optionGroup.option_name}: ${optItem.option_item_name}`,

                                    // 🔥 Giữ nguyên data backend trả về
                                    option_group_id: optionGroup.option_id,
                                    option_group_name: optionGroup.option_name,

                                    option_item_id: optItem.option_item_id,
                                    option_item_name: optItem.option_item_name,

                                    price: Number(optItem.price || 0),
                                    required: optionGroup.require_select,
                                    multi_select: optionGroup.multi_select,
                                  },
                                ]);
                              } else {
                                setSelectedToppings((prev) =>
                                  prev.filter(
                                    (t) =>
                                      t.option_item_id !==
                                      optItem.option_item_id
                                  )
                                );
                              }
                            }}
                            disabled={!isAvailable}
                          />
                          <Label htmlFor={optItem.option_item_id}>
                            {optItem.option_item_name}
                          </Label>
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          +{Number(optItem.price).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    );
                  })}
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
            <span>
              Giá món ăn ({quantity} x {menuItem.price.toLocaleString("vi-VN")}
              đ)
            </span>
            <span>{(menuItem.price * quantity).toLocaleString("vi-VN")}đ</span>
          </div>

          {selectedToppings.length > 0 && (
            <div className="flex justify-between">
              <span>
                Toppings ({quantity} x{" "}
                {toppingsTotalPrice.toLocaleString("vi-VN")}đ)
              </span>
              <span>
                {(toppingsTotalPrice * quantity).toLocaleString("vi-VN")}đ
              </span>
            </div>
          )}

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng</span>
            <span className="text-orange-600">
              {itemTotalPrice.toLocaleString("vi-VN")}đ
            </span>
          </div>
        </div>

        <DialogFooter className="flex-col space-y-2 sm:flex-row sm:space-y-0">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            onClick={handleAddToCart}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600"
            disabled={!isAvailable}
          >
            {isAvailable ? "Thêm vào giỏ hàng" : "Hết hàng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
