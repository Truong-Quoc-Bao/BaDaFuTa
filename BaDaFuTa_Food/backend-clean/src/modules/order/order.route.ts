import { Router } from "express";
import { createCODOrder, getOrder } from "./order.controller";
// import { createCODOrder } from "./order.controller";
const router = Router();
router.post("/", createCODOrder);
router.post("/getOrder", getOrder);
export default router;
