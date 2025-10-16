import Restaurant from "../models/Restaurant.js";

export const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.getAll();

    // map lại để FE dùng đúng
    const response = restaurants.map((r) => ({
      id: r.id,
      merchant_name: r.name,
      cuisine: r.cuisine,
      location: r.location,
      // rating: r.rating,
      cover_image: { url: r.image }, // FE dùng cover_image.url
      coordinates: r.coordinates,
      deliveryTime: "30-40 phút", // mock
      deliveryFee: 0, // mock
      menu: [
        { id: 1, name: "Phở bò", price: 50000 },
        { id: 2, name: "Bún chả", price: 60000 },
      ],
    }));

    res.json(response); // trả **mảng tất cả nhà hàng**
  } catch (error) {
    console.error("Lỗi khi lấy danh sách nhà hàng:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};
