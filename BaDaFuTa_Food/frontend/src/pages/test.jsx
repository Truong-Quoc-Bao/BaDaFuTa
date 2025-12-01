{/* 🧩 Nếu đang chỉnh sửa hoặc thêm mới thì chỉ hiển thị form */}
{isEditing || isAdding ? (
  <div className="space-y-4">

    {/* Nút quay lại */}
    <Button
      variant="outline"
      onClick={() => {
        setIsEditing(false);
        setIsAdding(false);
      }}
      className="w-10 h-10 flex items-center justify-center rounded-full"
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>

    <div className="space-y-2">
      <Label>Họ tên:* </Label>
      <Input
        name="full_name"
        value={formData.full_name}
        onChange={handleInputChange}
        placeholder="Nhập họ tên người nhận"
      />
    </div>

    <div className="space-y-2">
      <Label>Số điện thoại:* </Label>
      <Input
        name="phone"
        value={formData.phone}
        onChange={handleInputChange}
        placeholder="Nhập số điện thoại"
      />
    </div>

    <div className="space-y-2">
      <Label>Địa chỉ:* </Label>
      <Input
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        placeholder="Nhập địa chỉ giao hàng"
      />
    </div>

    <div className="space-y-2">
      <Label>Ghi chú</Label>
      <Textarea
        name="note"
        value={formData.note}
        onChange={handleInputChange}
        placeholder="Ghi chú (nếu có)"
      />
    </div>

    {/* Footer căn giữa */}
    <DialogFooter className="flex justify-center gap-4 mt-4">
      <Button
        variant="outline"
        onClick={() => {
          setIsEditing(false);
          setIsAdding(false);
        }}
      >
        Hủy
      </Button>

      <Button
        variant="outline"
        className="bg-orange-600 hover:bg-orange-700 text-white"
        onClick={isEditing ? handleSaveEdit : handleSaveAdd}
      >
        {isEditing ? 'Lưu thay đổi' : 'Thêm địa chỉ'}
      </Button>
    </DialogFooter>
  </div>
)}
