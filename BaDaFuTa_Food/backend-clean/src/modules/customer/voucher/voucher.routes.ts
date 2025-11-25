import { Router } from "express";
import { getAllVouchers } from "./voucher.controller";

const router = Router();

router.post("/getAll", getAllVouchers);

export default router;
