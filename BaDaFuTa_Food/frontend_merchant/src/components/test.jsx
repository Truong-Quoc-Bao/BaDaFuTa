const merchantLat = merchant?.location?.lat ?? 0;
const merchantLng = merchant?.location?.lng ?? 0;

const deliveryLat = selectedAddress?.lat ?? 0;
const deliveryLng = selectedAddress?.lng ?? 0;

const distanceKm = getDistanceKm(merchantLat, merchantLng, deliveryLat, deliveryLng);
const deliveryFee = distanceKm <= 3 ? 16000 : 16000 + Math.ceil(distanceKm - 3) * 4000;
const deliveryTime = estimateDeliveryTime(distanceKm);

console.log('Distance (km):', distanceKm);
console.log('Delivery Fee (VND):', deliveryFee);
console.log('Estimated Delivery Time (min):', deliveryTime);
