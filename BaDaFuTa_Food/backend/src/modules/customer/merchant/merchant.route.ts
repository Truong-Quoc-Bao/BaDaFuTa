import { Router } from "express";
import { listMerchants, OutStandingMerchant } from "./merchant.controller";

const router = Router();
router.get("/", listMerchants); // GET /api/v1/merchants
router.get("/future", OutStandingMerchant);

export default router;
