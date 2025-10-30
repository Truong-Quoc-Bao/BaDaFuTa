import dotenv from "dotenv";
import pkg from "pg";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

(async () => {
  try {
    const c = await pool.connect();
    console.log("Connected to PostgreSQL");
    c.release();
  } catch (err) {
    console.error("DB connect failed:", err.message);
  }
})();
