/**
 * Tính khoảng cách (km) giữa 2 điểm lat/lon theo Haversine formula
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} khoảng cách (km)
 */
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;

  const R = 6371; // bán kính Trái Đất (km)
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Tính phí giao hàng dựa vào khoảng cách
 * @param {number} distanceKm
 * @returns {number} phí ship (VNĐ)
 */
export function calculateDeliveryFee(distanceKm) {
  if (distanceKm <= 2) return 10000;
  if (distanceKm <= 5) return 15000;
  if (distanceKm <= 10) return 20000;
  return 30000; // >10km
}
/**
 * Tính thời gian giao hàng dựa vào khoảng cách (km)
 * Giả sử tốc độ trung bình 25 km/h
 * @param {number} distanceKm
 * @returns {number} phút
 */
export function estimateDeliveryTime(distanceKm) {
  const speedKmH = 25;
  const timeH = distanceKm / speedKmH;
  return Math.ceil(timeH * 60); // phút
}
