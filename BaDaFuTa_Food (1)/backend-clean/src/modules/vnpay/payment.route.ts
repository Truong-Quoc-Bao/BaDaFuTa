import { Router } from "express";
import { paymentController } from "./payment.controller";

const router = Router();

router.post("/initiate", paymentController.initiate);

// ⚠️ Thay "/callback" thành "/vnpay-return"
router.get("/vnpay-return", paymentController.callback);

export default router;
