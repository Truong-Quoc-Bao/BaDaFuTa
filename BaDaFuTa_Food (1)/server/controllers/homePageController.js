import Restaurant from "../models/Restaurant.js";

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.getAll();
    res.json(restaurants);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
