import { Router } from "express";
import { dashBoard } from "../merchant-dashboard";

const router = Router();

router.use("/merchant", dashBoard);

export default router;