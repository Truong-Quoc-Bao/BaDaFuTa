import { Router } from "express";
import { merchantDashboardController } from "./merchant-dashboard.controller";

const router = Router();
router.post("/overview", merchantDashboardController.overview);

export default router;
