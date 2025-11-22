import { useState, useEffect } from "react";
import { getDistanceKm, calculateDeliveryFee } from "../utils/distanceUtils"; // đường dẫn tới file hiện tại

export function useDeliveryFee(restaurantCoords, userCoords) {
  const [fee, setFee] = useState(0);

  useEffect(() => {
    if (!restaurantCoords || !userCoords) {
      setFee(0);
      return;
    }

    const distance = getDistanceKm(
      restaurantCoords.lat,
      restaurantCoords.lng,
      userCoords.lat,
      userCoords.lng
    );

    const calculatedFee = calculateDeliveryFee(distance);
    setFee(calculatedFee);
  }, [restaurantCoords, userCoords]);

  return fee;
}
