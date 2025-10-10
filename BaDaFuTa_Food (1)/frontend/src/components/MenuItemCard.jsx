import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "../contexts/CartContext";
import { ToppingSelectionDialog } from "./ToppingSelectionDialog";
import { toast } from "sonner@2.0.3";
import {
  getOptimizedFoodImage,
  optimizeImageUrl,
  hasDiscount,
  calculateDiscountPercentage,
} from "../utils/imageUtils";

export const MenuItemCard = ({ menuItem, restaurant, layout = "vertical" }) => {
  const { addItem } = useCart();
//   const navigate = useNavigate();
//   const [showToppingDialog, setShowToppingDialog] = useState(false);

//   // Check if item is available
//   const isAvailable = menuItem.isAvailable !== false;

//   // Check if item has toppings or required options
//   const hasToppings = menuItem.toppings && menuItem.toppings.length > 0;

//   const handleQuickAdd = (e) => {
//     e.stopPropagation(); // Prevent opening detail dialog

//     // E1: Check availability first
//     if (!isAvailable) {
//       toast.error(
//         "Sản phẩm đã hết hàng/ngừng kinh doanh, vui lòng chọn sản phẩm khác."
//       );
//       return;
//     }

//     // Step 4 from Use Case: Show topping selection if item has toppings
//     if (hasToppings) {
//       setShowToppingDialog(true);
//     } else {
//       // Direct add to cart if no toppings (simpler items)
//       addItem(menuItem, restaurant);
//       toast.success(`Đã thêm ${menuItem.name} vào giỏ hàng`);
//     }
//   };

//   const handleCardClick = () => {
//     navigate(`/restaurant/${restaurant.id}/item/${menuItem.id}`);
//   };

//   const handleCloseToppingDialog = () => {
//     setShowToppingDialog(false);
//   };

  // Vertical layout for catalog page (new design with image on top)
  if (layout === "vertical") {
    return (
      <>
        <Card
          className={`overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 ${
            !isAvailable ? "opacity-60" : ""
          }`}
          onClick={handleCardClick}
        >
          <div className="flex flex-col h-80">
            {/* Image - takes up 50% of the card height */}
            <div className="h-1/2 relative">
              <ImageWithFallback
                src={optimizeImageUrl(
                  getOptimizedFoodImage(menuItem.name, menuItem.image),
                  400,
                  300
                )}
                alt={menuItem.name}
                className={`w-full h-full object-cover ${
                  !isAvailable ? "grayscale" : ""
                }`}
              />

              {/* Overlay badges */}
              <div className="absolute top-2 left-2 flex flex-col space-y-1">
                {!isAvailable && (
                  <Badge variant="destructive" className="text-xs">
                    Hết hàng
                  </Badge>
                )}
                {hasToppings && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-blue-500 text-white"
                  >
                    Tùy chọn
                  </Badge>
                )}
              </div>

              {/* Quick view button */}
              <div className="absolute top-2 right-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick();
                  }}
                  className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content - takes up 50% of the card height */}
            <div className="h-1/2 p-4 flex flex-col justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {menuItem.name}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                  {menuItem.description}
                </p>
              </div>

              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  {hasDiscount(menuItem) ? (
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-orange-600 text-lg">
                          {menuItem.price.toLocaleString("vi-VN")}đ
                        </span>
                        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
                          -
                          {calculateDiscountPercentage(
                            menuItem.originalPrice,
                            menuItem.price
                          )}
                          %
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 line-through">
                        {menuItem.originalPrice.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold text-orange-600 text-lg">
                      {menuItem.price.toLocaleString("vi-VN")}đ
                    </span>
                  )}
                  {hasToppings && (
                    <span className="text-xs text-gray-500 mt-1">
                      + tùy chọn thêm
                    </span>
                  )}
                </div>

                <Button
                  size="sm"
                  onClick={handleQuickAdd}
                  disabled={!isAvailable}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 flex-shrink-0 w-10 h-10 p-0 rounded-lg"
                  title={isAvailable ? "Thêm vào giỏ hàng" : "Hết hàng"}
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Dialogs */}
        <ToppingSelectionDialog
          isOpen={showToppingDialog}
          onClose={handleCloseToppingDialog}
          menuItem={menuItem}
          restaurant={restaurant}
          quantity={1}
        />
      </>
    );
  }

  // Default layout (vertical card with image on top)
  return (
    <>
      <Card
        className={`overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 ${
          !isAvailable ? "opacity-60" : ""
        }`}
        onClick={handleCardClick}
      >
        <div className="flex flex-col h-80">
          {/* Image - takes up 50% of the card height */}
          <div className="h-1/2 relative">
            <ImageWithFallback
              src={menuItem.image}
              alt={menuItem.name}
              className={`w-full h-full object-cover ${
                !isAvailable ? "grayscale" : ""
              }`}
            />

            {/* Overlay badges */}
            <div className="absolute top-2 left-2 flex flex-col space-y-1">
              {!isAvailable && (
                <Badge variant="destructive" className="text-xs">
                  Hết hàng
                </Badge>
              )}
              {hasToppings && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-blue-500 text-white"
                >
                  Tùy chọn
                </Badge>
              )}
            </div>

            {/* Quick view button */}
            <div className="absolute top-2 right-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCardClick}
                className="w-8 h-8 p-0 bg-white/80 hover:bg-white"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content - takes up 50% of the card height */}
          <div className="h-1/2 p-4 flex flex-col justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {menuItem.name}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {menuItem.description}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-orange-600 text-lg">
                  {menuItem.price.toLocaleString("vi-VN")}đ
                </span>
                {hasToppings && (
                  <span className="text-xs text-gray-500">+ tùy chọn thêm</span>
                )}
              </div>

              <Button
                size="sm"
                onClick={handleQuickAdd}
                disabled={!isAvailable}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 flex-shrink-0 w-10 h-10 p-0 rounded-lg"
                title={isAvailable ? "Thêm vào giỏ hàng" : "Hết hàng"}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Dialogs */}
      <ToppingSelectionDialog
        isOpen={showToppingDialog}
        onClose={handleCloseToppingDialog}
        menuItem={menuItem}
        restaurant={restaurant}
        quantity={1}
      />
    </>
  );
};
