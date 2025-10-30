import express from "express";
import {
  getRestaurants,
  getMenu,
} from "../controllers/restaurantController.js";

const router = express.Router();
//lấy tất cả nhà hàng
router.get("/", getRestaurants);
// lấy menu của nhà hàng 
router.get("/:id/menu", getMenu);

export default router;
