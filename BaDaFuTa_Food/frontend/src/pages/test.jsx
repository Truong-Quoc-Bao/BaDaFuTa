{/* Địa chỉ giao hàng */}
<div className="flex items-start gap-2 text-sm text-gray-500">
  {/* Icon MapPin */}
  <MapPin className="w-4 h-4 text-accent mt-2 flex-shrink-0" />

  <div className="flex flex-col w-full">
    {/* Dòng Input hoặc Text Địa chỉ */}
    <div className="flex flex-wrap w-full items-center min-h-[40px]">
      <span className="mr-1">Địa chỉ giao hàng:</span>
      
      {isEditing || !selectedAddress.address ? (
        <Input
          name="address"
          value={formData.address}
          onChange={handleInputChange}
          placeholder="Nhập địa chỉ giao hàng"
          className="font-semibold text-gray-900 break-words flex-1 h-9"
        />
      ) : (
        <span className="font-semibold text-gray-900 break-words flex-1">
          {selectedAddress?.address || 'Chưa có địa chỉ'}
        </span>
      )}
    </div>

    {/* 🔥 NÚT LẤY VỊ TRÍ - Nằm dưới cùng, thẳng hàng với text */}
    <div className="mt-2">
      <Button
        variant="outline"
        size="sm"
        className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 h-8 px-3 text-xs font-medium flex items-center gap-2 transition-colors"
        onClick={handleGetCurrentLocation}
        type="button" // Để không bị submit form nếu nằm trong form
      >
        <LocateFixed className="w-3.5 h-3.5" />
        Lấy vị trí hiện tại
      </Button>
    </div>
  </div>
</div>