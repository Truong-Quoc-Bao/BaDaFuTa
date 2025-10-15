import express from "express";
import { getAllRestaurants } from "../controllers/homePageController.js";

const router = express.Router();

router.get("/", getAllRestaurants);

export default router;
