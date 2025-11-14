import { Router } from "express";
import { customerRoutes } from "@/modules/customer";
import { merchantRoutes } from "@/modules/merchant-store";
const router = Router();
router.use("/", customerRoutes);
router.use("/", merchantRoutes);

export default router;
