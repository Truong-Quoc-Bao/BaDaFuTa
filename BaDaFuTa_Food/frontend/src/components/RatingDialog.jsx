import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Star } from "lucide-react";

export const RatingDialog = ({ open, onOpenChange, order, onSubmitRating }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá");
      return;
    }

    const newRating = {
      orderId: order.id,
      rating,
      review: review.trim(),
      date: new Date().toISOString(),
    };

    onSubmitRating(newRating);

    // Reset form
    setRating(0);
    setReview("");
    setHoveredRating(0);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setRating(0);
    setReview("");
    setHoveredRating(0);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Đánh giá đơn hàng</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm của bạn về đơn hàng từ {order.restaurantName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={order.restaurantImage}
              alt={order.restaurantName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium">{order.restaurantName}</p>
              <p className="text-sm text-gray-500">Mã đơn: {order.id}</p>
              <p className="text-sm text-gray-500">
                Tổng tiền: {(order?.total || 0).toLocaleString("vi-VN")}đ
              </p>
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <Label>Đánh giá của bạn</Label>
            <div className="flex items-center space-x-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="p-1 hover:scale-110 transition-transform"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {rating === 1 && "Rất không hài lòng"}
                {rating === 2 && "Không hài lòng"}
                {rating === 3 && "Bình thường"}
                {rating === 4 && "Hài lòng"}
                {rating === 5 && "Rất hài lòng"}
              </p>
            )}
          </div>

          {/* Review Text */}
          <div>
            <Label htmlFor="review">Nhận xét (tùy chọn)</Label>
            <Textarea
              id="review"
              placeholder="Chia sẻ trải nghiệm của bạn về chất lượng món ăn, dịch vụ giao hàng..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              className="mt-2"
            />
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600"
            disabled={rating === 0}
          >
            Gửi đánh giá
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
