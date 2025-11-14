import { Router } from "express";
import {
  createCODOrder,
  getOrder,
  updateOrder,
  updateOrderBody,
} from "./order.controller";
// import { createCODOrder } from "./order.controller";
const router = Router();
router.post("/", createCODOrder);
router.post("/getOrder", getOrder);
router.put("/:orderId/update", updateOrder); // xài cái này update
router.put("/:orderId/updateBody", updateOrderBody); // không xài cái này
export default router;
