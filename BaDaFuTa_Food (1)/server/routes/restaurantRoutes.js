import express from "express";
import {
  getRestaurants,
  getMenu,
} from "../controllers/restaurantController.js";

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:code/menu", getMenu);

export default router;
