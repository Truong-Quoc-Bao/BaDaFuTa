import { Router } from "express";
import { listMerchants } from "./merchant.controller";

const router = Router();
router.get("/", listMerchants); // GET /api/v1/merchants
export default router;
