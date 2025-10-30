import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "./ui/button"; // button của bạn
import { X } from "lucide-react";

export default function ConfirmSwitchDialog({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-md shadow-lg p-6">
          <Dialog.Title className="text-lg font-semibold text-gray-900">
            Xác nhận đổi nhà hàng
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-600">
            Bạn đang thêm món từ nhà hàng khác, giỏ hàng hiện tại sẽ bị xóa.
            Tiếp tục?
          </Dialog.Description>

          <div className="mt-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              className="bg-gray-100 hover:bg-gray-200"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
            >
              Đồng ý
            </Button>
          </div>

          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
