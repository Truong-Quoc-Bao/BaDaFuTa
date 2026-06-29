import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export default function AddressDialog({ open, onClose, onSelect }) {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Trương Quốc Bảo",
      phone: "0982500276",
      address: "Chung cư Mizuki Flora",
    },
    {
      id: 2,
      name: "Trương Quốc Bảo",
      phone: "0399503025",
      address: "22 Phước Kiển, Nhà Bè",
    },
  ]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  const handleSave = () => {
    if (editing) {
      setAddresses(
        addresses.map((a) => (a.id === editing ? { ...a, ...form } : a))
      );
    } else {
      setAddresses([...addresses, { id: Date.now(), ...form }]);
    }
    setForm({ name: "", phone: "", address: "" });
    setEditing(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Địa chỉ giao hàng</DialogTitle>
        </DialogHeader>

        {/* Danh sách địa chỉ */}
        <div className="space-y-4 max-h-[400px] overflow-y-auto">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="border rounded-lg p-3 flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{a.name}</p>
                <p>{a.phone}</p>
                <p className="text-sm text-gray-500">{a.address}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditing(a.id);
                    setForm(a);
                  }}
                >
                  Sửa
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    onSelect(a);
                    onClose();
                  }}
                >
                  Chọn
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Form thêm/sửa */}
        <div className="mt-4 border-t pt-3 space-y-2">
          <Label>{editing ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</Label>
          <Input
            placeholder="Họ tên"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            placeholder="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
          <Button
            onClick={handleSave}
            className="bg-orange-500 text-white w-full"
          >
            {editing ? "Lưu thay đổi" : "Thêm địa chỉ mới"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
