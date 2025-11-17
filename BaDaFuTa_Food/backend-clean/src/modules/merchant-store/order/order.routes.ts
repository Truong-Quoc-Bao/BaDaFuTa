import { Router } from "express";
import { merchantOrderController } from "./order.controller";

const router = Router();

router.post("/update-status", merchantOrderController.updateStatus);

export default router;
