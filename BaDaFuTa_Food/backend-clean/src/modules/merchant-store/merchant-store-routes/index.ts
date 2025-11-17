import { Router } from "express";
import { dashBoard } from "../merchant-dashboard";
import { order } from "../order";

const router = Router();

router.use("/merchant", dashBoard);
router.use("/merchant", order);

export default router;
