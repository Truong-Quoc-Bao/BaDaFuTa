<div className="text-white font-bold text-sm flex items-center gap-1">
  {restaurant?.rating != null ? (
    <>
      {restaurant.rating} <Star className="w-4 h-4 text-yellow-400" />
    </>
  ) : (
    'Chưa có đánh giá nhà hàng'
  )}
</div>
