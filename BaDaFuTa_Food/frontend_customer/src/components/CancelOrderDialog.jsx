import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { AlertTriangle } from "lucide-react";

export const CancelOrderDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title = "Xác nhận hủy đơn hàng",
  description = "Bạn có chắc chắn muốn hủy đơn hàng này không? Thao tác này không thể hoàn tác.",
  confirmText = "Đồng ý, hủy đơn",
  cancelText = "Không, tiếp tục",
  variant = "destructive",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle
              className={`w-5 h-5 ${
                variant === "warning" ? "text-orange-500" : "text-red-500"
              }`}
            />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "warning" ? "outline" : "destructive"}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={
              variant === "warning"
                ? "border-orange-500 text-orange-600 hover:bg-orange-50"
                : ""
            }
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
