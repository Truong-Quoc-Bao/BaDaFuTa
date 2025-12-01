{isEditing || !selectedAddress.address ? (
  <Input
    name="address"
    value={formData.address}
    onChange={handleInputChange}
    onBlur={async (e) => {
      // Khi người dùng rời khỏi ô input → force geocoding ngay lập tức (tránh đợi 800ms)
      const value = e.target.value.trim();
      if (value && value.length > 10) {
        const coords = await geocodeAddress(value);
        if (coords) {
          const updated = {
            ...formData,
            address: value,
            lat: coords.lat,
            lng: coords.lng,
          };
          setFormData(updated);
          setSelectedAddress(updated);
          localStorage.setItem(`selectedAddress_${user?.id}`, JSON.stringify(updated));
        }
      }
    }}
    placeholder="VD: 58 QL1A, Mỹ Yên, Bến Lức, Long An"
    className="font-semibold text-gray-900 break-words"
  />
) : (
  <span className="font-semibold text-gray-900 break-words">
    {selectedAddress?.address || 'Chưa có địa chỉ'}
  </span>
)}