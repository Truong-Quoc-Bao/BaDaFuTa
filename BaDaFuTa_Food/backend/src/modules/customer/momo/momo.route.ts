import { Router } from "express";
import { momoController } from "./momo.controller";

const router = Router();

router.post("/create", momoController.initiate);
router.post("/callback", momoController.callback); // POST here
router.get("/return", momoController.return); // optional

export default router;
