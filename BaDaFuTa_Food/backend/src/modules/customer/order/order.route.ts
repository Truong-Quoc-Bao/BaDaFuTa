import { Router } from "express";
import {
  createCODOrder,
  getOrder,
  updateOrder,
  updateOrderBody,
  cancelOrder,
  updateRatingOrder,
  createRatingOrder,
  getRatingOrder,
  deleteRatingOrder,
} from "./order.controller";
// import { createCODOrder } from "./order.controller";
const router = Router();
router.post("/", createCODOrder);
router.post("/getOrder", getOrder);
router.get("/:orderId/getRating", getRatingOrder);
router.delete("/:orderId/deleteRating", deleteRatingOrder);
router.post("/:orderId/createRating", createRatingOrder);
router.put("/:orderId/update", updateOrder);
router.put("/:orderId/cancel", cancelOrder);
router.put("/:orderId/updateRating", updateRatingOrder);
router.put("/:orderId/updateBody", updateOrderBody); // không xài cái này
export default router;