import { Router } from "express";
import { createCODOrder } from "./order.controller";

const router = Router();
router.post("/", createCODOrder);
export default router;
