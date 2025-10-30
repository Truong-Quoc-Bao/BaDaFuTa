import { pool } from "../db.js";

export default class Restaurant {
  constructor({ id, name, cuisine, address, rating, image, coordinates }) {
    this.id = id;
    this.name = name;
    this.cuisine = cuisine;
    this.address = address;
    this.rating = rating;
    this.image = image;
    this.coordinates = coordinates; // { lat, lng }
  }

  // ====== 🔹 "Schema" mô phỏng kiểu mongoose ======
  static schema = {
    name: "string",
    cuisine: "string",
    address: "string",
    rating: "number",
    image: "string",
    coordinates: {
      lat: "number",
      lng: "number",
    },
  };

  // ====== 🔹 Các phương thức CRUD ======
  static async getAll() {
    const result = await pool.query("SELECT * FROM merchant");
    return result.rows.map((row) => new Restaurant(row));
  }

  static async getById(id) {
    const result = await pool.query("SELECT * FROM merchant WHERE id = $1", [
      id,
    ]);
    return result.rows.length ? new Restaurant(result.rows[0]) : null;
  }

  static async create({ name, cuisine, address, rating, image, coordinates }) {
    const result = await pool.query(
      `INSERT INTO merchant (name, cuisine, address, rating, image, lat, lng)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, cuisine, address, rating, image, coordinates.lat, coordinates.lng]
    );
    return new Restaurant(result.rows[0]);
  }

  static async update(
    id,
    { name, cuisine, address, rating, image, coordinates }
  ) {
    const result = await pool.query(
      `UPDATE merchant
       SET name = $1, cuisine = $2, address = $3, rating = $4, image = $5, lat = $6, lng = $7
       WHERE id = $8
       RETURNING *`,
      [
        name,
        cuisine,
        address,
        rating,
        image,
        coordinates.lat,
        coordinates.lng,
        id,
      ]
    );
    return result.rows.length ? new Restaurant(result.rows[0]) : null;
  }

  static async delete(id) {
    const result = await pool.query("DELETE FROM merchant WHERE id = $1", [id]);
    return result.rowCount > 0;
  }
}
