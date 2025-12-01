import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";
import { useState } from "react";

export default function PopupVoucher({
  open,
  onClose,
  vouchers,
  onSelect,
  cartTotal,
}) {
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  console.log("Tổng cộng:", cartTotal || null);

  // Kiểm tra điều kiện áp dụng voucher
  const isInvalid =
    selectedVoucher && cartTotal < (selectedVoucher.min_order_value ?? 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-0 bg-white overflow-hidden border border-gray-300">
        {/* HEADER */}
        <DialogHeader className="p-4 border border-gray-300">
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            Chọn voucher
          </DialogTitle>
        </DialogHeader>

        {/* LIST */}
        <div className="max-h-[400px] md:max-h-[600px] overflow-y-auto p-4 space-y-4">
          {vouchers.length === 0 && (
            <p className="text-gray-500 text-sm text-center">
              Không có voucher khả dụng
            </p>
          )}

          {vouchers.map((v) => (
            <label
              key={v.id}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 shadow-lg flex items-center justify-between cursor-pointer"
            >
              <input
                type="radio"
                name="voucher"
                checked={selectedVoucher?.id === v.id}
                onChange={() => setSelectedVoucher(v)}
                className="w-5 h-5 accent-white mr-4 cursor-pointer"
              />

              <div className="flex-1 flex items-start gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <Gift className="w-5 h-5" />
                </div>

                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold leading-tight">
                    {v.title}
                  </h3>

                  <p className="text-white/90 text-sm mt-1 line-clamp-2">
                    {v.description || "Ưu đãi dành riêng cho bạn"}
                  </p>

                  <Badge className="w-fit mt-2 bg-white text-gray-800 font-semibold">
                    {v.code}
                  </Badge>

                  {/* Min order value */}
                  {v.min_order_value > 0 && (
                    <p className="text-xs text-white/90 mt-1 italic">
                      Áp dụng cho đơn từ {v.min_order_value.toLocaleString()}đ
                    </p>
                  )}

                  <p className="text-xs text-white/80 mt-1">
                    HSD: {new Date(v.end_date).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </label>
          ))}
        </div>

        {/* FOOTER */}
        <DialogFooter
          className="p-4 border border-gray-300 
            flex !flex-row w-full 
            !justify-center items-center 
            space-x-4 !space-y-0"
        >
          <Button variant="outline" onClick={onClose} className="w-32">
            Đóng
          </Button>

          <Button
            disabled={!selectedVoucher || isInvalid}
            onClick={() => {
              if (isInvalid) return; // 🔒 chặn luôn
              onSelect(selectedVoucher);
              onClose();
            }}
            className={`w-32 font-semibold px-6
              ${
                isInvalid
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700 text-white"
              }`}
          >
            {isInvalid ? "Không đủ điều kiện" : "Sử dụng"}
          </Button>
        </DialogFooter>

        {/* ERROR MESSAGE */}
        {isInvalid && (
          <p className="text-red-600 text-center text-sm pb-3">
            Đơn hàng của bạn chưa đạt mức tối thiểu để dùng voucher này.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
